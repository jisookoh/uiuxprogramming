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

// 기본 설정 이벤트

const $themeButton = document.querySelector("#theme-button");
const $nameInput = document.querySelector("#name");
const $nameCount = document.querySelector("#name-count");
const $agreeCheck = document.querySelector("#agree-check");
const $agreeMessage = document.querySelector("#agree-message");
const $startButton = document.querySelector("#start-button");

function handleThemeClick(event) {
  const isDark = document.body.classList.toggle("dark");

  $themeButton.textContent = isDark
    ? "라이트 테마로 바꾸기"
    : "다크 테마로 바꾸기";
}

$themeButton.addEventListener("click", handleThemeClick);

function handleNameInput() {
  const maxLength = $nameInput.maxLength;
  const currentLength = Math.min($nameInput.value.length, maxLength);

  $nameCount.textContent = currentLength + " / " + maxLength;
}

$nameInput.addEventListener("input", handleNameInput);

function handleAgreeChange() {
  const agreed = $agreeCheck.checked;

  $startButton.disabled = !agreed;
  $agreeMessage.textContent = agreed
    ? "전송 할 수 있습니다."
    : "동의 후 전송할 수 있습니다.";

  if (agreed) {
    $agreeMessage.classList.add("is-ready");
  } else {
    $agreeMessage.classList.remove("is-ready");
  }
}

$agreeCheck.addEventListener("change", handleAgreeChange);

// tabs
const $tabs = document.querySelectorAll(".tab");
const $panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
  $tabs.forEach(function (tab) {
    tab.classList.remove("is-active");
    tab.setAttribute("aria-selected", false);
  });

  $panels.forEach(function (panel) {
    panel.classList.remove("is-active");
    panel.hidden = true;
  });
}

function activateTab(clickedTab) {
  const targetSelector = clickedTab.dataset.target;
  const $targetPanel = document.querySelector(targetSelector);

  clickedTab.classList.add("is-active");
  clickedTab.setAttribute("aria-selected", "true");

  $targetPanel.classList.add("is-active");
  $targetPanel.hidden = false;
}

function handleTabClick(event) {
  resetTabsAndPanels();
  activateTab(event.currentTarget);
}

$tabs.forEach(function (tab) {
  tab.addEventListener("click", handleTabClick);
});
