import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FC } from "react";

export interface PortfolioAnalysis {
	overallDiversity: string;
	sectorBalance: string[];
	risksAndOpportunities: string[];
	suggestions: string[];
	status: string;
}

interface PortfolioAnalysisDisplayProps {
	analysis: PortfolioAnalysis;
}

export const PortfolioAnalysisDisplay: FC<PortfolioAnalysisDisplayProps> = ({
	analysis,
}) => {
	if (!analysis) {
		return <></>;
	}
	return (
		<Card className="w-full mt-4">
			<CardHeader>
				<CardTitle>Portfolio Analysis</CardTitle>
			</CardHeader>
			<CardContent>
				{analysis.status && (
					<div className="mb-4">
						<p className="text-sm text-gray-600">{analysis?.status}</p>
					</div>
				)}
				{!analysis.status && (
					<>
						<div className="mb-4">
							<h3 className="text-lg font-semibold mb-2">Overall Diversity:</h3>
							<p className="text-sm text-gray-600">
								{analysis?.overallDiversity}
							</p>
						</div>
						<div className="mb-4">
							<h3 className="text-lg font-semibold mb-2">Sector Balance:</h3>
							<p className="text-sm text-gray-600">{analysis?.sectorBalance}</p>
						</div>
						<div className="mb-4">
							<h3 className="text-lg font-semibold mb-2">
								Risks and Opportunities:
							</h3>
							<ul className="list-disc pl-5 text-sm text-gray-600">
								{analysis.risksAndOpportunities?.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</div>
						<div className="mb-4">
							<h3 className="text-lg font-semibold mb-2">Suggestions:</h3>
							<ul className="list-disc pl-5 text-sm text-gray-600">
								{analysis.suggestions?.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};
