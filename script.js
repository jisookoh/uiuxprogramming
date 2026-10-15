const $themeButton = document.querySelector("#theme-button");
const $tabs = document.querySelectorAll(".tab");
const $panels = document.querySelectorAll(".panel");

$themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  $themeButton.textContent = isDark ? "라이트" : "다크";
});

$tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    $tabs.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    $panels.forEach((panel) => {
      panel.classList.remove("is-active");
      panel.hidden = true;
    });

    const $panel = document.querySelector(tab.dataset.target);
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    $panel.classList.add("is-active");
    $panel.hidden = false;
  });
});

const $messageForm = document.querySelector("#message-form");
const $agreeCheck = document.querySelector("#agree-check");
const $submitButton = document.querySelector("#submit-btn");
const $sendMessageDialog = document.querySelector("#send-message-dialog");
const $sendMessageCancel = document.querySelector("#send-message-cancel");
const $sendMessageConfirm = document.querySelector("#send-message-confirm");
const $sendMessageFlow = document.querySelector("#send-message-flow");
const $flowSteps = $sendMessageFlow.querySelectorAll(".step");
const $progressItems = $sendMessageFlow.querySelectorAll(".progress__item");

const $nicknameInput = document.querySelector("#flow-nickname");
const $nicknameError = document.querySelector("#nickname-error");
const $nicknameNext = document.querySelector("#nickname-next");
const $relationInputs = document.querySelectorAll('input[name="relation"]');
const $relationError = document.querySelector("#relation-error");
const $detailRelation = document.querySelector("#detail-relation");
const $otherRelation = document.querySelector("#other-relation");
const $detailError = document.querySelector("#detail-error");
const $messageInput = document.querySelector("#congratulation-message");
const $messageCount = document.querySelector("#message-count");
const $messageError = document.querySelector("#message-error");

const formData = {};

function showStep(index) {
  $flowSteps.forEach((step, i) => {
    step.hidden = i !== index;
  });
  $progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index);
  });
}

function handleAgreeChange() {
  $submitButton.disabled = !$agreeCheck.checked;
}

function revokeSendMessageAgreement() {
  $agreeCheck.checked = false;
  $sendMessageFlow.hidden = true;
  handleAgreeChange();
  $agreeCheck.focus();
}

$agreeCheck.addEventListener("change", handleAgreeChange);
$messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if ($agreeCheck.checked) $sendMessageDialog.showModal();
});
$sendMessageCancel.addEventListener("click", () => {
  $sendMessageDialog.close();
  revokeSendMessageAgreement();
});
$sendMessageDialog.addEventListener("cancel", revokeSendMessageAgreement);
$sendMessageConfirm.addEventListener("click", () => {
  if (!$agreeCheck.checked) return;
  $sendMessageDialog.close();
  $sendMessageFlow.hidden = false;
  showStep(0);
  $sendMessageFlow.scrollIntoView({ behavior: "smooth" });
  $nicknameInput.focus();
});

$nicknameNext.addEventListener("click", () => {
  const nickname = $nicknameInput.value.trim();
  if (!nickname) {
    $nicknameError.textContent = "이름 또는 닉네임을 입력해 주세요.";
    $nicknameInput.classList.add("has-error");
    $nicknameInput.focus();
    return;
  }
  formData.nickname = nickname;
  $nicknameError.textContent = "";
  $nicknameInput.classList.remove("has-error");
  showStep(1);
});

$detailRelation.addEventListener("change", () => {
  const isOther = $detailRelation.value === "기타";
  $otherRelation.hidden = !isOther;
  if (!isOther) $otherRelation.value = "";
});

document
  .querySelector("#option-prev")
  .addEventListener("click", () => showStep(0));
document.querySelector("#option-next").addEventListener("click", () => {
  const $relation = document.querySelector('input[name="relation"]:checked');
  if (!$relation) {
    $relationError.textContent = "신랑 또는 신부를 선택해 주세요.";
    $relationInputs[0].focus();
    return;
  }
  if (!$detailRelation.value) {
    $relationError.textContent = "";
    $detailError.textContent = "세부 관계를 선택해 주세요.";
    $detailRelation.focus();
    return;
  }
  if ($detailRelation.value === "기타" && !$otherRelation.value.trim()) {
    $detailError.textContent = "기타 관계를 입력해 주세요.";
    $otherRelation.focus();
    return;
  }

  formData.relation = $relation.value;
  formData.detailRelation =
    $detailRelation.value === "기타"
      ? $otherRelation.value.trim()
      : $detailRelation.value;
  $relationError.textContent = $detailError.textContent = "";
  showStep(2);
  $messageInput.focus();
});

$messageInput.addEventListener("input", () => {
  $messageCount.textContent = `${$messageInput.value.length} / 300`;
});
document
  .querySelector("#message-prev")
  .addEventListener("click", () => showStep(1));
document.querySelector("#message-next").addEventListener("click", () => {
  const message = $messageInput.value.trim();
  if (!message) {
    $messageError.textContent = "축하 메시지를 입력해 주세요.";
    $messageInput.classList.add("has-error");
    $messageInput.focus();
    return;
  }

  formData.message = message;
  $messageError.textContent = "";
  $messageInput.classList.remove("has-error");
  document.querySelector("#summary-nickname").textContent = formData.nickname;
  document.querySelector("#summary-relation").textContent = formData.relation;
  document.querySelector("#summary-detail-relation").textContent =
    formData.detailRelation;
  document.querySelector("#summary-message").textContent = formData.message;
  showStep(3);
});

function resetMessageFlow() {
  $nicknameInput.value = $messageInput.value = $otherRelation.value = "";
  $detailRelation.value = "";
  $relationInputs.forEach((input) => (input.checked = false));
  $otherRelation.hidden = true;
  document
    .querySelectorAll(".error-message")
    .forEach((error) => (error.textContent = ""));
  document
    .querySelectorAll(".has-error")
    .forEach((input) => input.classList.remove("has-error"));
  document
    .querySelectorAll(".summary-list strong")
    .forEach((item) => (item.textContent = ""));
  Object.keys(formData).forEach((key) => delete formData[key]);
  $messageCount.textContent = "0 / 300";
  showStep(0);
  $nicknameInput.focus();
}

document
  .querySelector("#summary-prev")
  .addEventListener("click", resetMessageFlow);
document
  .querySelector("#finish-button")
  .addEventListener("click", () => showStep(4));
document
  .querySelector("#resend-button")
  .addEventListener("click", resetMessageFlow);
