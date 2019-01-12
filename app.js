#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const ejs = require('ejs')
let input = [], validatedFields = [], unValidatedFields = []
let formName = ''
const inputFields = ["email","button", "checkbox", "color", "date", "datetime-local", "month", "number", "range", "search", "tel", "time", "url", "week", "file", "hidden", "image", "password", "radio", "reset", "text"]

validateInput = (inp) => {
    input = inp.toLowerCase().split(',')
    input.forEach(element => {
        if (inputFields.indexOf(element) >= 0) {
            validatedFields.push(element)
        } else {
            unValidatedFields.push(element)
        }
    });
}

generateHtml = () => {
    var name = Math.round((new Date()).getTime() / 1000)+'.html';
    var destination = (process.cwd()).replace(/\\/g,"/") + '/' + name 
    ejs.renderFile('template.ejs', {'arr': validatedFields}, (err, html) => {
        if (err) console.error(err);

        fs.writeFile(destination, html, (err) => {
            if (err) console.log('Cant create form file');
            console.log('HTML file created : ' + name );
        });

    });
    if (unValidatedFields.length) {
        console.log("Some fields have been unvalidated : "+JSON.stringify(unValidatedFields))
    }
}

start = (inp) => {
    validateInput(inp);
    generateHtml()
}

run = () => {
    program
        .version('0.1.0')
        .option('-f, --fields [fields]', 'Add fields separated by comma')
        .parse(process.argv);
    if (program.fields) start(program.fields)
    else console.log('Add some fields to the form to generate.')
}

run()