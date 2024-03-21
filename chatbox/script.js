const ChatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = ChatInput.scrollHeight;

const createChatLi = (message , className) =>{
    //Create a chat <li> element with passed message and className
    const chatLi =document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent = className === "outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}  

const  generateResponse = (incomingChatLi) =>{
    const API_URL ="https://api.openai.com/v1/chat/completions";
    const messageElement =incomingChatLi.querySelector("p");

    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body : JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:userMessage}] 
        })
    }
    // sending post request to api , get response
    fetch(API_URL,requestOptions).then(res =>res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent = "OOPS! something went wrong please try again.";
    }).finally(()=>chatBox.scrollTo(0,chatBox.scrollHeight));
}

const handleChat =() =>{
    userMessage =ChatInput.value.trim();
    if (!userMessage) return;
    ChatInput.value = "";
    ChatInput.computedStyleMap.height = `${ChatInput.scrollHeight}px`;

  
    //appending the user chat to chatbox
   chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0,chatBox.scrollHeight);

   setTimeout(() =>{
    // displaying thinking message while waiting 
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    chatBox.scrollTo(0,chatBox.scrollHeight);
    generateResponse(incomingChatLi);
},600)
}

ChatInput.addEventListener("input", ()=>{
    // adding height to input area based on the content
    ChatInput.computedStyleMap.height = `${inputInitHeight}px`;
    ChatInput.computedStyleMap.height = `${ChatInput.scrollHeight}px`;

})

ChatInput.addEventListener("keyup", (e)=>{
   if (e.key === "Enter" && !e.shiftkey && window.innerWidth>800) {
    e.preventDefault();
    handleChat();
   }
})

sendChatBtn.addEventListener("click",handleChat);

chatbotToggler.addEventListener("click",()=> document.body.classList.toggle("show-chatbot"));

chatbotCloseBtn.addEventListener("click",()=> document.body.classList.remove("show-chatbot"));
