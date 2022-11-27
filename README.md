# Comment-buster
Comment-buster is a VS Code extension that searches through code files for chunks of commented out code and extraneous print statements (per language I use - TypeScript, Python, or C/C++). It then shows a report panel with those sections called out. This way, you can delete those lines so you don't end up with layers of commented out sections and extraneous print statements when you do a dev commit to park your work. Next time, you can start leaving a fresh mess!


## Get Started
* Install the extension (download from here).
* Bring up the VS Code Command Palette (Ctrl+Shift+P on Windows) and choose to `Bust` comments or print statements.
* Use the `Comment Buster Panel` and `Print Buster Panel` to find sections to clean up.
* Clean up, save your files, and rinse/repeat until you're good to park your work.


## How I Use Comment-Buster

Comment-buster supports the hack and slash way I could when prototyping, hacking around an unfamiliar repo, or coming back to a repo I had been working on a few months before. 

Regardless of how I start or get back into a project, I tend to liberally copy/paste chunks of code and comment out large swaths (even whole files) while reviewing and re-learning and discovering what is safe to delete. If these code bases were only a few files big, it wouldn't be too hard to clean up after that. However, I tend to like to have lots of small/medium-ish sized files and evolve my logic/methods side-by-side with the previous on-filesystem version. And so on, until I'm at a decent parking point for my progress.

This is where cleaning up becomes a nuisance. I'm pretty good with where the current logic is. I want to quickly clean up and commit. So I need to find the chunks I commented out across my codebase and the print statements I've left littered while working through/rebuilding my knowledge. Which is why I created Comment-buster. Find those chunks of commented out code and extraneous print statements and quickly navigate to them. You can delete those lines and sections so you don't end up with layers of commented out sections and extraneous print statements. 

Next time, clean up after yourself quickly so you can leave a fresh mess!

## In Action

![Comment Buster](docs/images/comment-buster-screenshot.png)

<!-- 
For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them. -->
<!-- 
## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/) -->

**Enjoy!**
