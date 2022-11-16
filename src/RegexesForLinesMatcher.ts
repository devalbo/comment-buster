import { IPrintStatementSection } from "./printStatementBusterInterfaces";



export type RflmLineClassifications = 
  'e' |  // empty/blank line
  'm' |  // regex matching line
  'x';   // non-empty, non-regex-matching line


export const classifyLine = (currentLine: string, regexesToMatch: string[]): RflmLineClassifications => {
  const text = currentLine.trim();

  if (text.length === 0) {
    return 'e';
  }
  
  for (let i=0; i < regexesToMatch.length; i++) {
    const regexStr = regexesToMatch[i];
    const regex = new RegExp(regexStr);
    const matches = currentLine.match(regex);
    if (matches && matches?.length > 0) {
      return 'm';
    }
    // if (text.startsWith(commentLineStarter)) {
    //   return 'c';
    // }
  }

  return 'x';
};


export const findMatchingRegexSectionsForLines = (lines: string[], regexesToMatch: string[]): IPrintStatementSection[] => {
  
  const commentSections: IPrintStatementSection[] = [];

  const lineClassifications = lines.map(l => classifyLine(l, regexesToMatch));
  const lineClassificationsNotation = lineClassifications.join('');

  const regex = /(c+((e|c)*)c+)/gm;

  const allMatches = lineClassificationsNotation.matchAll(regex);
  let next = allMatches.next();

  while (!next.done) {
    const lineNumber = next.value.index! + 1;
    const sectionLength = next.value[0].length;

    const commentSection = {
      startLineNumber: lineNumber,
      endLineNumber: lineNumber + sectionLength - 1,
    } as IPrintStatementSection;

    commentSections.push(commentSection);
    next = allMatches.next();
  }

  return commentSections;
};
