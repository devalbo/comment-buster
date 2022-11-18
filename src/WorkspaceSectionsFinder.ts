import { CommentSectionsFinder } from "./commentBuster/CommentSectionsFinder";
import { ICommentSectionFinderResult, ICommentSectionsFinder } from './commentBusterInterfaces';
import { ILanguageConfiguration } from './LanguageConfigurations';
import { PrintStatementSectionsFinder } from './printStatementBuster/PrintStatementSectionsFinder';
import { IPrintStatementSectionFinderResult, IPrintStatementSectionsFinder } from './printStatementBusterInterfaces';
import { findFileCandidates } from './utils';



export class WorkspaceSectionsFinder implements ICommentSectionsFinder, IPrintStatementSectionsFinder {
 
  findCommentSections = async (languageConfiguration: ILanguageConfiguration): Promise<ICommentSectionFinderResult[]> => {

    const globPatternToInclude = languageConfiguration.getGlobPatternToInclude();
    const globPatternsToExclude = languageConfiguration.getGlobPatternsToExclude();

    const fileCandidates = await findFileCandidates(globPatternToInclude, globPatternsToExclude);

    const tsFinder = new CommentSectionsFinder();
    const commentSections = await tsFinder.findCommentSections(fileCandidates, languageConfiguration.commentCharacters);

    return commentSections;
  };


  findPrintStatementSections = async (languageConfiguration: ILanguageConfiguration): Promise<IPrintStatementSectionFinderResult[]> => {

    const globPatternToInclude = languageConfiguration.getGlobPatternToInclude();
    const globPatternsToExclude = languageConfiguration.getGlobPatternsToExclude();

    const fileCandidates = await findFileCandidates(globPatternToInclude, globPatternsToExclude);

    console.log("PRINT STATEMENT REGEXES");
    console.log(languageConfiguration.printStatementLineRegexes);

    const tsFinder = new PrintStatementSectionsFinder();
    const printStatementSections = await tsFinder.findPrintStatementSections(fileCandidates, languageConfiguration.printStatementLineRegexes);
    
    return printStatementSections;
  };
}
