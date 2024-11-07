new framework for quiz helper, see

[ucertify-quiz-helper](https://github.com/0guanhua0/ucertify-quiz-helper)

# quiz helper for ucertify Project Management Professional (PMP)
only support choice questions

## demo
![demo](./pic/demo.png)

## usage
1. install [Tampermonkey](https://www.tampermonkey.net/)

[guide](https://www.tampermonkey.net/faq.php?locale=en#Q100)

2. install the script

click the link below

https://raw.githubusercontent.com/0guanhua0/pmp-quiz-helper/refs/heads/main/helper.user.js

[guide](https://www.tampermonkey.net/faq.php?locale=en#Q102)

3. check browser console

![console](./pic/console.png)

## retake
if error, retake can refresh the score
![retake](./pic/retake.png)

## support
please file issues for support

or to modify the database quiz.js, always run the check
```shell
guanhua@arch ~/pmp-quiz-helper (git)-[main] % npm run format
```

## roadmap
- [ ] use cv to get info. for text app, use [ocr](https://en.wikipedia.org/wiki/Optical_character_recognition)
- [ ] use ai to understand the context and answer the question

## tips
ai can help development, but it can introduce bugs. these kind of bugs are hard to debug because it seems correct.

ai can provide general suggestions, but final decision should base on the project context.

for text app, it's hard to deal with special characters. for example
```javascript
function normalizeText(text) {
  console.log("Normalizing text:", text);
  return text
    .replace(/’/g, "'")
    .replace(/–/g, "-")
    .replace(/“/g, '"')
    .replace(/”/g, '"');
}
```

possible solution:
- hash. but it's exact match, so any change will break
- ai. this add flexibility, but add extra cost

it's stupid to code database because it's easy to mess up and hard to debug. always run the full check before and after the change. i use .js as database just to make it easy for tampermonkey to pull the dependency.
