import { useContext } from "react";
import { UnitShapeNotFoundError } from "src/data/common";
import { unitShapes } from "src/data/unitShapes";
import { Feature } from "src/map";
import { colors } from "src/utils/colors";
import { QuestionNotFoundError } from "../../../common";
import { FeatureNotFoundError, type MapQuestion } from "../../state";
import { MapGameStoreContext } from "../../storeContext";

export interface GameFeatureProps {
    featureId: string;
}

export function GameFeature({ featureId }: GameFeatureProps) {
    const useMapGameStore = useContext(MapGameStoreContext);

    const feature = useMapGameStore((game) => game.features[featureId]);
    if (!feature) throw new FeatureNotFoundError(featureId);

    const shape = unitShapes.find((shape) => shape.id === feature.unitId);
    if (!shape) throw new UnitShapeNotFoundError(feature.unitId);

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

    const [fill, hoverFill] = getGuessedFeatureStyle(question);
    return (
        <Feature
            shape={shape.outline.hq}
            onClick={handleClick}
            fill={fill}
            hoverFill={hoverFill}
        />
    );
}

function getGuessedFeatureStyle(question: MapQuestion | null): [string | undefined, string | undefined] {
    if (question && question.guessed) {
        if (question.tries === 0) {
            return [colors.teal60, colors.teal55];
        } else if (question.tries === 1) {
            return [colors.teal40, colors.teal35];
        } else if (question.tries === 2) {
            return [colors.teal30, colors.teal25];
        } else {
            return [colors.red55, colors.red50];
        }
    }
    return [undefined, undefined];
}
