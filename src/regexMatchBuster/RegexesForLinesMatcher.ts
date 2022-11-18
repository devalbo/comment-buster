import { IRegexMatchLinesSection } from "./regexBusterInterfaces";



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
  }

  return 'x';
};


export const matchLineClassifications = (lineClassifications: RflmLineClassifications[]): IRegexMatchLinesSection[] => {
  const lineClassificationsNotation = lineClassifications.join('');

  // const regex = /(m+e*m+)|(m+)/gm;
  const regex = /(m+(e*m+)*)|(m+)/gm;

  const allMatches = lineClassificationsNotation.matchAll(regex);

  const regexSections: IRegexMatchLinesSection[] = [];
  let next = allMatches.next();

  while (!next.done) {
    const lineNumber = next.value.index! + 1;
    const sectionLength = next.value[0].length;
    
    const regexSection = {
      startLineNumber: lineNumber,
      endLineNumber: lineNumber + sectionLength - 1,
    } as IRegexMatchLinesSection;

    regexSections.push(regexSection);
    next = allMatches.next();
  }

  return regexSections;
};


export const findMatchingRegexSectionsForLines = (lines: string[], regexesToMatch: string[]): IRegexMatchLinesSection[] => {
  
  const lineClassifications = lines.map(l => classifyLine(l, regexesToMatch));
  const matchLineSections = matchLineClassifications(lineClassifications);
  return matchLineSections;
};
