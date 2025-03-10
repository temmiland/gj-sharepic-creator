import { colorSets } from "../../constants/colors";
import H1 from "../atoms/H1";
import "./SharePicHeading.scss";

type SharePicHeadingProps = {
	multiLineText: string[];
	colorSet: ColorSet;
	highlightColor: HighlightColor;
	fontSize: number;
};

export function SharePicHeading({ multiLineText, colorSet, highlightColor, fontSize }: SharePicHeadingProps) {

	return (
		<div className="heading">
			{
				multiLineText.map((line) => (
					line !== "" ? (
						<H1
							key={line}
							fontSize={fontSize}
							fontColor={
								line.startsWith('*')
									? highlightColor.name === "Black"
											? colorSets.find(cS => cS.name === "White")?.backgroundColor!!
											: colorSets.find(cS => cS.name === "Black")?.backgroundColor!!
									: colorSet.name === "White"
											? colorSets.find(cS => cS.name === "White")?.backgroundColor!!
											: colorSets.find(cS => cS.name === "Black")?.backgroundColor!!
							}
							backgroundColor={
								line.startsWith('*')
									? highlightColor.backgroundColor
									: colorSet.name === "White"
											? colorSets.find(cS => cS.name === "Black")?.backgroundColor!!
											: colorSets.find(cS => cS.name === "White")?.backgroundColor!!
							}
						>
							{line.replace('*', '')}
						</H1>
					) : null
				))
			}
		</div>
	);
}
