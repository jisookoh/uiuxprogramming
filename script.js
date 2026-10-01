const serviceName = "wedding";

const $messageForm = document.querySelector("#message-form");
const $nickNameInput = document.querySelector("#nickname");
const $contentTextarea = document.querySelector("#content");
const $submitButton = document.querySelector("#submit-btn");
const $notice = document.querySelector("#notice");

let isSubmitted = false;
let submitCount = 0;

function makesubscribeMessage(nickName, submitted) {
  if (submitted) return `${nickName}로 축하메세지를 남겼습니다!`;

  return "닉네임과 축하의 한마디를 입력하여 두 사람에게 축하의 메세지를 남겨보세요.";
}

function handleSubmit(event) {
  event.preventDefault();

  const nickName = $nickNameInput.value.trim();
  const content = $contentTextarea.value.trim();

  if (nickName === "") {
    $notice.textContent = "닉네임을 입력해주세요.";
    $nickNameInput.focus();
    return;
  }

  if (content === "") {
    $notice.textContent = "축하의 한마디를 입력해주세요.";
    $contentTextarea.focus();
    return;
  }

  isSubmitted = true;
  submitCount += 1;

  $notice.textContent = makesubscribeMessage(nickName, isSubmitted);
  $notice.classList.add("is-success");

  $submitButton.textContent = "전송 완료";
  $submitButton.disabled = true;

  $nickNameInput.value = "";
  $contentTextarea.value = "";
}

$messageForm.addEventListener("submit", handleSubmit);
