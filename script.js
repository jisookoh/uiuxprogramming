const $themeButton = document.querySelector("#theme-button");
const $themeIcon = document.querySelector("#theme-icon");
const $tabs = document.querySelectorAll(".tab");
const $panels = document.querySelectorAll(".panel");
const $historyImages = document.querySelectorAll(".history-image");
const $historyImageDialog = document.querySelector("#history-image-dialog");
const $historyLargeImage = document.querySelector("#history-large-image");
const $historyImageClose = document.querySelector("#history-image-close");

$themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  $themeIcon.src = isDark
    ? "./assets/icons/sun.svg"
    : "./assets/icons/moon.svg";
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

$historyImages.forEach((image) => {
  image.addEventListener("click", () => {
    $historyLargeImage.src = image.src;
    $historyLargeImage.alt = image.alt;
    $historyImageDialog.showModal();
  });
});

$historyImageClose.addEventListener("click", () => {
  $historyImageDialog.close();
});

const $openMessageButton = document.querySelector("#open-message-button");
const $agreeCheck = document.querySelector("#agree-check");
const $agreeNext = document.querySelector("#agree-next");
const $sendMessageDialog = document.querySelector("#send-message-dialog");
const $sendMessageCancel = document.querySelector("#send-message-cancel");
const $dialogCloseButton = document.querySelector("#dialog-close-button");
const $form = document.querySelector("#send-message-flow");
const $flowSteps = $form.querySelectorAll(".step");
const $progress = $form.querySelector(".progress");
const $progressItems = $form.querySelectorAll(".progress__item");
const $guestbookList = document.querySelector("#guestbook-list");
const $saveButton = document.querySelector("#finish-button");
const $submitStatus = document.querySelector("#submit-status");
const $completeMessage = document.querySelector("#complete-message");
let isSubmitting = false;
let currentStep = 0;

const $nicknameInput = document.querySelector("#flow-nickname");
const $nicknameError = document.querySelector("#nickname-error");
const $nicknameNext = document.querySelector("#nickname-next");
const $relationInputs = document.querySelectorAll('input[name="relation"]');
const $relationError = document.querySelector("#relation-error");
const $detailRelation = document.querySelector("#detail-relation");
const $otherRelation = document.querySelector("#other-relation");
const $detailError = document.querySelector("#detail-error");
const $messagesField = document.querySelector("#messages-field");
const $messageInput = document.querySelector("#congratulation-message");
const $messageHelper = document.querySelector("#message-helper");
const $messageCount = document.querySelector("#message-count");
const $messageError = document.querySelector("#message-error");

const GUESTBOOK_STORAGE_KEY = "wedding-guestbook-entries";
const formData = {};
let guestbookEntries = loadGuestbookEntries();

function showStep(index) {
  currentStep = index;
  $flowSteps.forEach((step, i) => {
    step.hidden = i !== index;
  });

  $progress.hidden = index === 0 || index === 5;
  $progressItems.forEach((item, i) => {
    item.classList.toggle("is-active", i === index - 1);
    item.classList.toggle("is-complete", i < index - 1);
  });
}

function updateMessageExperience() {
  const length = $messageInput.value.length;
  const valid = $messageInput.value.trim().length >= 10 && length <= 300;
  const hasError = $messageInput.getAttribute("aria-invalid") === "true";

  $messageCount.textContent = `${length} / 300자`;
  $messagesField.classList.toggle("has-error", hasError);
  $messagesField.classList.toggle("is-valid", valid && !hasError);
  $messageHelper.textContent = hasError
    ? "축하 메시지 입력 조건을 다시 확인해 주세요."
    : valid
      ? "입력 조건을 충족했습니다."
      : "10자 이상 300자 이하로 입력해 주세요.";
}

function validateMessage() {
  const message = $messageInput.value.trim();

  if (!message) {
    $messageError.textContent = "축하 메시지를 입력해 주세요.";
    $messageInput.setAttribute("aria-invalid", "true");
    updateMessageExperience();
    $messageInput.focus();
    return false;
  }

  if (message.length < 10) {
    $messageError.textContent = "축하 메시지는 10자 이상 입력해 주세요.";
    $messageInput.setAttribute("aria-invalid", "true");
    updateMessageExperience();
    $messageInput.focus();
    return false;
  }

  $messageError.textContent = "";
  $messageInput.removeAttribute("aria-invalid");
  $messageInput.classList.remove("has-error");
  updateMessageExperience();
  return true;
}

function handleAgreeChange() {
  $agreeNext.disabled = !$agreeCheck.checked;
}

function validateNickname() {
  const nickname = $nicknameInput.value.trim();

  if (!nickname) {
    $nicknameError.textContent = "이름 또는 닉네임을 입력해 주세요.";
    $nicknameInput.classList.add("has-error");
    $nicknameInput.focus();
    return false;
  }

  formData.nickname = nickname;
  $nicknameError.textContent = "";
  $nicknameInput.classList.remove("has-error");
  return true;
}

function validateRelation() {
  const $relation = document.querySelector('input[name="relation"]:checked');

  if (!$relation) {
    $relationError.textContent = "신랑 또는 신부를 선택해 주세요.";
    $relationInputs[0].focus();
    return false;
  }

  if (!$detailRelation.value) {
    $relationError.textContent = "";
    $detailError.textContent = "세부 관계를 선택해 주세요.";
    $detailRelation.focus();
    return false;
  }

  if ($detailRelation.value === "기타" && !$otherRelation.value.trim()) {
    $detailError.textContent = "기타 관계를 입력해 주세요.";
    $otherRelation.focus();
    return false;
  }

  formData.relation = $relation.value;
  formData.detailRelation =
    $detailRelation.value === "기타"
      ? $otherRelation.value.trim()
      : $detailRelation.value;
  $relationError.textContent = $detailError.textContent = "";
  return true;
}

function updateMessageSummary() {
  formData.message = $messageInput.value.trim();
  document.querySelector("#summary-nickname").textContent = formData.nickname;
  document.querySelector("#summary-relation").textContent = formData.relation;
  document.querySelector("#summary-detail-relation").textContent =
    formData.detailRelation;
  document.querySelector("#summary-message").textContent = formData.message;
}

$agreeCheck.addEventListener("change", handleAgreeChange);

$openMessageButton.addEventListener("click", () => {
  resetMessageFlow();
  $sendMessageDialog.showModal();
  $agreeCheck.focus();
});

$sendMessageCancel.addEventListener("click", () => {
  $sendMessageDialog.close();
});

$dialogCloseButton.addEventListener("click", () => {
  $sendMessageDialog.close();
});

$agreeNext.addEventListener("click", () => {
  if (!$agreeCheck.checked) return;
  showStep(1);
  $nicknameInput.focus();
});

$nicknameNext.addEventListener("click", () => {
  if (validateNickname()) {
    showStep(2);
  }
});

$detailRelation.addEventListener("change", () => {
  const isOther = $detailRelation.value === "기타";
  $otherRelation.hidden = !isOther;
  if (!isOther) $otherRelation.value = "";
});

document
  .querySelector("#option-prev")
  .addEventListener("click", () => showStep(1));

document.querySelector("#option-next").addEventListener("click", () => {
  if (validateRelation()) {
    showStep(3);
    $messageInput.focus();
  }
});

$messageInput.addEventListener("input", () => {
  if ($messageInput.getAttribute("aria-invalid") === "true") {
    validateMessage();
  } else {
    updateMessageExperience();
  }
});

updateMessageExperience();

document
  .querySelector("#message-prev")
  .addEventListener("click", () => showStep(2));

document.querySelector("#message-next").addEventListener("click", () => {
  if (validateMessage()) {
    updateMessageSummary();
    showStep(4);
  }
});

function setSubmitState(state, message) {
  isSubmitting = state === "loading";
  $form.setAttribute("aria-busy", String(isSubmitting));
  $saveButton.disabled = isSubmitting;
  $saveButton.textContent = isSubmitting ? "등록하는 중..." : "방명록 등록하기";
  $submitStatus.textContent = message;
  $submitStatus.classList.toggle("is-success", state === "success");
  $submitStatus.classList.toggle("has-error", state === "error");
}

function resetMessageFlow() {
  setSubmitState("idle", "");
  $agreeCheck.checked = false;
  handleAgreeChange();
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
  $messageInput.removeAttribute("aria-invalid");
  $messagesField.classList.remove("is-valid", "is-error");
  updateMessageExperience();
  setSubmitState("idle", "");
  document
    .querySelectorAll(".summary-list strong")
    .forEach((item) => (item.textContent = ""));
  Object.keys(formData).forEach((key) => delete formData[key]);
  updateMessageExperience();
  showStep(0);
}

document.querySelector("#summary-prev").addEventListener("click", () => {
  showStep(1);
  $nicknameInput.focus();
});

function loadGuestbookEntries() {
  try {
    const savedEntries = JSON.parse(
      localStorage.getItem(GUESTBOOK_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(savedEntries) ? savedEntries : [];
  } catch (error) {
    return [];
  }
}

function saveGuestbookEntries() {
  try {
    localStorage.setItem(
      GUESTBOOK_STORAGE_KEY,
      JSON.stringify(guestbookEntries),
    );
    return true;
  } catch (error) {
    return false;
  }
}

function addGuestbookItem(guestbookEntry) {
  const $item = document.createElement("li");
  const $meta = document.createElement("div");
  const $nickname = document.createElement("strong");
  const $relation = document.createElement("span");
  const $message = document.createElement("p");

  $item.className = "guestbook-item";
  $item.dataset.guestbookEntry = guestbookEntry.id;
  $meta.className = "guestbook-meta";
  $nickname.textContent = guestbookEntry.nickname;
  $relation.textContent = `${guestbookEntry.relation} · ${guestbookEntry.detailRelation}`;
  $message.textContent = guestbookEntry.message;

  $meta.append($nickname, $relation);
  $item.append($meta, $message);
  $guestbookList.append($item);
}

function renderGuestbookEntries() {
  $guestbookList
    .querySelectorAll("[data-guestbook-entry]")
    .forEach((item) => item.remove());
  guestbookEntries.forEach(addGuestbookItem);
}

function saveCurrentGuestbookEntry() {
  const guestbookEntry = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    ...formData,
    cancelled: false,
    createdAt: new Date().toISOString(),
  };

  guestbookEntries.unshift(guestbookEntry);
  if (!saveGuestbookEntries()) {
    guestbookEntries.shift();
    return false;
  }

  renderGuestbookEntries();
  $completeMessage.textContent = `${guestbookEntry.nickname}님의 축하 메시지가 방명록에 등록되었습니다.`;
  return true;
}

renderGuestbookEntries();

$form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (currentStep === 1) {
    if (validateNickname()) showStep(2);
    return;
  }

  if (currentStep === 2) {
    if (validateRelation()) {
      showStep(3);
      $messageInput.focus();
    }
    return;
  }

  if (currentStep === 3) {
    if (validateMessage()) {
      updateMessageSummary();
      showStep(4);
    }
    return;
  }

  if (currentStep !== 4 || isSubmitting) return;

  if (!validateMessage()) {
    showStep(3);
    $messageInput.focus();
    return;
  }

  setSubmitState("loading", "방명록을 등록하는 중입니다.");

  window.setTimeout(() => {
    if (!saveCurrentGuestbookEntry()) {
      setSubmitState(
        "error",
        "등록하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.",
      );
      return;
    }

    setSubmitState("success", "방명록 등록이 완료되었습니다.");
    showStep(5);
  }, 600);
});

document
  .querySelector("#guestbook-close-button")
  .addEventListener("click", () => {
    $sendMessageDialog.close();
  });
