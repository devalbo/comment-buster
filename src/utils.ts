import * as vscode from 'vscode';


// based on https://stackoverflow.com/a/69534630
// function setsIntersection(...sets) {
export const computeSetsIntersection = (sets: Set<vscode.Uri>[]): Set<vscode.Uri> => {
  if (sets.length < 1) {
    return new Set();
  }

  let minSize = sets[0].size;
  let minSetIndex = 0;

  for (let i = 1; i < sets.length; i++) {
    const size = sets[i].size;
    if (size < minSize) {
      minSize = size;
      minSetIndex = i;
    }
  }

  const result = new Set(sets[minSetIndex]);
  for (let i = 1; i < sets.length && i !== minSetIndex; i++) {
    for (const v of result) {
      if (!sets[i].has(v)) {
        result.delete(v);
      }
    }
  }

  return result;
};


  
export const findFileCandidates = async (globPatternToInclude: string, globPatternsToExclude: string[]): Promise<vscode.Uri[]> => {

  const findFileTasks = globPatternsToExclude.map(async globPatternToExclude => {
    const someFiles = await vscode.workspace.findFiles(globPatternToInclude, globPatternToExclude);
    return new Set(someFiles);
  });

  const allFindFileResults = await Promise.all(findFileTasks);
  const combinedFindFileResults = computeSetsIntersection(allFindFileResults);

  const fileCandidates = Array.from(combinedFindFileResults);

  return fileCandidates;
};


export const getTooltipForLines = (lines: string[], startLineNumber: number, endLineNumber: number) => {
  
  // const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${item.commentSection.startLineNumber}`, true);
  const tooltipLines = [];
  for (let i=startLineNumber-1; i < endLineNumber; i++) {
    tooltipLines.push(lines[i]);
  }

  const mdString = tooltipLines.join('\n\n');
  const tooltip = new vscode.MarkdownString("```\n" + mdString + "\n```");

  return tooltip;
};