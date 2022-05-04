
function enableEditMode() {
    richTextEditor.document.designMode = "On";
}

const editor = document.getElementById('editor');
let body = editor.contentDocument.querySelector('body');
body.style.color = 'white';
body.style.fontSize = 'large';
body.style.fontFamily = "Roboto,sans-serif";
body.style.margin = "0.5rem";



const buttons = document.querySelectorAll('.editor-btn');
buttons.forEach(button => {
    show = false;
    button.addEventListener('click', () => {
        let command = button.getAttribute('data-element');
        if (command == "insertImage" || command == "createLink") {
            let url = prompt("Enter link here: ");
            richTextEditor.document.execCommand(command, false, url);
        }
        else {
            richTextEditor.document.execCommand(command, false, null);
        }
    });
});


const button = document.getElementById('emojiPicker')
button.addEventListener('click', function toggleEmojiPicker() {
    tooltip.classList.toggle('shown')
})

const tooltip = document.querySelector('.tooltip')
Popper.createPopper(button, tooltip)


// Emoji 
document.querySelector('emoji-picker')
    .addEventListener('emoji-click', event => {
        if (event.detail.emoji.unicode)
            body.innerText += event.detail.emoji.unicode
    });


