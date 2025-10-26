import { useContext } from "react";
import { UnitShapeNotFoundError } from "src/data/common";
import { unitShapes } from "src/data/unitShapes";
import { Feature, type FeatureStyle } from "src/map";
import { colors } from "src/utils/colors";
import { QuestionNotFoundError } from "../../../common";
import { FeatureNotFoundError, type MapQuestion } from "../../state";
import { MapGameStoreContext } from "../../storeContext";
import { Ripple } from "./Ripple";

export interface GameFeatureProps {
    featureId: string;
}

export function GameFeature({ featureId }: GameFeatureProps) {
    const useMapGameStore = useContext(MapGameStoreContext);

    const feature = useMapGameStore((game) => game.features[featureId]);
    if (!feature)
        throw new FeatureNotFoundError(featureId);

    const shape = unitShapes.find((shape) => shape.id === feature.unitId);
    if (!shape)
        throw new UnitShapeNotFoundError(feature.unitId);

    const question = useMapGameStore((game) => (feature.questionId === undefined)
        ? null
        : game.questions[feature.questionId]);
    if (question === undefined)
        throw new QuestionNotFoundError(feature.questionId as string);

    const guess = useMapGameStore((game) => game.guess);
    const handleClick = () => {
        if (!question?.guessed) {
            guess(feature.unitId);
        }
    };

    const showRipple = !!(question && !question.guessed && question.tries > 3);
    const style = getFeatureStyle(question, showRipple);
    return (<>
        <Feature
            shape={shape.outline.hq}
            onClick={handleClick}
            style={style}
        />
        
        {showRipple && (
            <Ripple center={shape.center}/>
        )}
    </>);
}

/** Returns the fill color of a feature depending on the number of guesses. */
function getFeatureStyle(question: MapQuestion | null, showRipple: boolean): FeatureStyle | undefined {
    if (showRipple) {
        return {
            fill: colors.gray35,        // additionally highlight the feature when ripple shown
            hoverFill: colors.gray40,
            darkModeFill: colors.gray60,
            darkModeHoverFill: colors.gray55,
        };
    }
    if (question && question.guessed) {
        if (question.tries === 0) {
            return {
                fill: colors.teal60,
                hoverFill: colors.teal55,
                darkModeFill: colors.teal65,
                darkModeHoverFill: colors.teal60,
            };
        } else if (question.tries === 1) {
            return {
                fill: colors.teal40,
                hoverFill: colors.teal35,
                darkModeFill: colors.teal75,
                darkModeHoverFill: colors.teal70,
            };
        } else if (question.tries === 2) {
            return {
                fill: colors.teal30,
                hoverFill: colors.teal25,
                darkModeFill: colors.teal85,
                darkModeHoverFill: colors.teal80,
            };
        } else {
            return {
                fill: colors.red55,
                hoverFill: colors.red50,
                darkModeFill: colors.red60,
                darkModeHoverFill: colors.red55,
            };
        }
    }
}
