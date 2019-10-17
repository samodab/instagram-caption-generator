// "essentialHashtags[]" and "additionalHashtags[]" are in separate "hashtags.js" file
var hashtagLimit = 28;
var newHashtags = [];
var selectedEssential = essentialHashtags;
var selectedAdditional = additionalHashtags.slice(0, hashtagLimit - selectedEssential.length);
var selectedNew = [];

// Create an alert based on specified attributes
function showAlert(type, strongText, message){
  var container = document.getElementById("alertContainer");
  var div = document.createElement("div");
  var button = document.createElement("button");
  var span = document.createElement("span");
  var strong = document.createElement("strong");
  var strongText = document.createTextNode(strongText);
  var message = document.createTextNode(" " + message);
  div.classList.add("alert");
  div.classList.add(type);
  div.setAttribute("role", "alert");
  button.classList.add("close");
  button.setAttribute("type", "button");
  button.setAttribute("data-dismiss", "alert");
  button.setAttribute("aria-label", "Close");
  span.setAttribute("aria-hidden", "true");
  span.innerHTML = "&times;";
  button.appendChild(span);
  strong.appendChild(strongText);
  div.appendChild(button);
  div.appendChild(strong);
  div.appendChild(message);
  container.appendChild(div);
  $(div).fadeTo(0, 0).slideUp(0);
  $(div).fadeTo(500, 1).slideDown(500);
  window.setTimeout(function() {
      $(div).fadeTo(500, 0).slideUp(500, function(){
          $(this).remove();
      });
  }, 4000);
}

// Lock unchecked (deselected) checkboxes in "Additional" container
function lockAdditional(){
  var container = document.getElementById("additionalHashtags");
  if (container.hasChildNodes()){
    var children = container.childNodes;
    for (var i = 0; i < children.length; i++) {
      if(!children[i].childNodes[0].checked){
        children[i].childNodes[0].disabled = true;
      }
    }
  }
}

// Unlock unchecked (deselected) checkboxes in "Additional" container
function unlockAdditional(){
  var container = document.getElementById("additionalHashtags");
  if (container.hasChildNodes()){
    var children = container.childNodes;
    for (var i = 0; i < children.length; i++) {
      if(!children[i].childNodes[0].checked){
        children[i].childNodes[0].disabled = false;
      }
    }
  }
}

// Unlock checked (selected) checkboxes in "Additional" container
function unlockAdditionalChecked(){
  var container = document.getElementById("additionalHashtags");
  if (container.hasChildNodes()){
    var children = container.childNodes;
    for (var i = 0; i < children.length; i++) {
      if(children[i].childNodes[0].checked){
        children[i].childNodes[0].disabled = false;
      }
    }
  }
}

// Remove the first hashtag from "Additional" hashtags if more than "hashtagLimit"
function removeOneAdditional(){
  if (selectedAdditional.length > 0){
    selectedAdditional.shift();
    deselectElements(additionalHashtags);
    selectElements(selectedAdditional);
    lockAdditional();
    return true;
  }
  else{
    return false;
  }
}

// Update the counter values near category name in HTML
function updateCounters(){
  var essentialCount = document.getElementById("essentialCount");
  var additionalCount = document.getElementById("additionalCount");
  var newCount = document.getElementById("newCount");
  essentialCount.innerHTML = selectedEssential.length;
  additionalCount.innerHTML = selectedAdditional.length;
  newCount.innerHTML = selectedNew.length;
}

// Check (select) the checkboxes in HTML for every member of the given array
function selectElements(array){
  for (var i = 0; i < array.length; i++){
    document.getElementById(array[i]).checked = true;
  }
}

// Uncheck (deselect) the checkboxes in HTML for every member of the given array
function deselectElements(array){
  for (var i = 0; i < array.length; i++){
    document.getElementById(array[i]).checked = false;
  }
}

// Return the total number of all checked (selected) hashtags
function totalSelected(){
  var sum = selectedEssential.length + selectedAdditional.length + selectedNew.length;
  return sum;
}

// Remove all child HTML elements from given container
function removeElements(containerId){
  var container = document.getElementById(containerId);
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
}

// Check the state of the checkbox and add/remove from the array
function checkState(checkbox){
  var containerId = checkbox.parentElement.parentNode.id;
  if (checkbox.checked){
    // Checkbox is checked (selected)
    switch (containerId) {
      case "essentialHashtags":
        selectedEssential.push(checkbox.value);
        selectElements(selectedEssential);
        if (totalSelected() > hashtagLimit){
          removeOneAdditional();
        }
        break;
      case "newHashtags":
        selectedNew.push(checkbox.value);
        selectElements(selectedNew);
        if (totalSelected() > hashtagLimit){
          removeOneAdditional();
        }
        break;
      case "additionalHashtags":
        selectedAdditional.push(checkbox.value);
        selectElements(selectedAdditional);
        break;
      default:
        // error handling
    }
    if (totalSelected() == hashtagLimit){
      lockAdditional();
    }
    updateCounters();
  }
  else{
    // Checkbox is unchecked (deselected)
    switch (containerId) {
      case "essentialHashtags":
        var index = selectedEssential.indexOf(checkbox.value);
        if (index > -1) {
          selectedEssential.splice(index, 1);
          deselectElements(selectedEssential);
          selectElements(selectedEssential);
        }
        break;
      case "newHashtags":
        var index = selectedNew.indexOf(checkbox.value);
        if (index > -1) {
          selectedNew.splice(index, 1);
          deselectElements(selectedNew);
          selectElements(selectedNew);
        }
        break;
      case "additionalHashtags":
        var index = selectedAdditional.indexOf(checkbox.value);
        if (index > -1) {
          selectedAdditional.splice(index, 1);
          deselectElements(selectedAdditional);
          selectElements(selectedAdditional);
        }
        break;
      default:
        // error handling
    }
    if (totalSelected() < hashtagLimit){
      unlockAdditional();
    }
    updateCounters();
  }
}

// Create HTML elements for every member of the given array
function createElements(array){
  for (var i = 0; i < array.length; i++) {
    var div = document.createElement("div");
    var input = document.createElement("input");
    var label = document.createElement("label");
    var text = document.createTextNode(array[i]);
    div.classList.add("form-check");
    div.classList.add("form-check-inline");
    input.classList.add("form-check-input");
    input.type = "checkbox";
    input.id = array[i];
    input.value = array[i];
    input.addEventListener("click", function(){ checkState(this); });
    label.classList.add("form-check-label");
    label.htmlFor = array[i];
    label.appendChild(text);
    div.appendChild(input);
    div.appendChild(label);
    switch (array) {
      case essentialHashtags:
        document.getElementById("essentialHashtags").appendChild(div);
        break;
      case newHashtags:
        document.getElementById("newHashtags").appendChild(div);
        break;
      case additionalHashtags:
        document.getElementById("additionalHashtags").appendChild(div);
        break;
      default:
        // error handling
    }
  }
}

// Add new elements (hashtags)
function addNew(){
  var inputText = document.getElementById("newHashtag");
  if (inputText.value.length != 0){
    if(essentialHashtags.includes(inputText.value) || additionalHashtags.includes(inputText.value) || newHashtags.includes(inputText.value)){
      showAlert("alert-danger" , "Already exists!", "Hashtag is already in the list.");
      inputText.value = "";
    }
    else{
      newHashtags.push(inputText.value);
      selectedNew.push(inputText.value);
      removeElements("newHashtags");
      createElements(newHashtags);
      selectElements(selectedNew);
      inputText.value = '';
      inputText.focus();
      if (totalSelected() == hashtagLimit){
        lockAdditional();
      }
      if (totalSelected() > hashtagLimit){
        if(!removeOneAdditional()){
          showAlert("alert-danger" , "Warning!", ' Hashtag "' + selectedNew[0] + '"' + " was deselected, because the limit was reached!");
          selectedNew.shift();
          deselectElements(newHashtags);
          selectElements(selectedNew);
        }
      }
      updateCounters();
    }
  }
}

// Shuffle the elements inside given array
function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex){
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Randomize selected additional hashtags
function randomize(){
  var count = selectedAdditional.length;
  selectedAdditional = [];
  unlockAdditional();
  deselectElements(additionalHashtags);
  shuffle(additionalHashtags);
  selectedAdditional = additionalHashtags.slice(0, hashtagLimit - selectedEssential.length - selectedNew.length);
  selectElements(selectedAdditional);
  lockAdditional();
  updateCounters();
}

// Copy caption text to clipboard
function copyToClipboard() {
  /* Get the text field */
  var copyText = document.getElementById("generatedText");
  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  /* Copy the text inside the text field */
  document.execCommand("copy");
  copyText.blur();
  showAlert("alert-success", "Success!", "Caption was generated and copied to clipboard");
}

// Generate the caption
function generate(){
  var selectedAll = selectedEssential.concat(selectedAdditional).concat(selectedNew);
  var container = document.getElementById("generatedText");
  var headerDefault = document.getElementById("headerDefault");
  var headerCustom = document.getElementById("headerCustom");
  var footerDefault = document.getElementById("footerDefault");
  var footerCustom = document.getElementById("footerCustom");
  var headerText;
  var footerText;
  var bodyText = document.getElementById("bodyText").value;
  while (container.hasChildNodes()){
    container.removeChild(container.childNodes[0]);
  }
  if (headerDefault.checked == true){
    headerText = document.getElementById("headerDefaultText").value;
  }
  else{
    headerText = document.getElementById("headerCustomText").value;
  }
  if (footerDefault.checked == true){
    footerText = document.getElementById("footerDefaultText").value;
  }
  else{
    footerText = document.getElementById("footerCustomText").value;
  }
  var bodyTextNode = document.createTextNode(bodyText);
  var headerTextNode = document.createTextNode(headerText);
  var footerTextNode = document.createTextNode(footerText);
  var hashtagSymbol = document.createTextNode("#");
  shuffle(selectedAll);
  var hashtags = document.createTextNode(selectedAll.join(" #"));
  container.appendChild(headerTextNode);
  container.appendChild(bodyTextNode);
  container.appendChild(document.createTextNode("\n"));
  container.appendChild(document.createTextNode("\n"));
  container.appendChild(footerTextNode);
  container.appendChild(document.createTextNode("\n"));
  container.appendChild(hashtagSymbol);
  container.appendChild(hashtags);
  copyToClipboard();
}

// Event listener for any input in the "Add new hashtag" textfield
var previousValue = document.getElementById('newHashtag').value;
// Regular Expression for both lowercase and uppercase letters, numbers and underscore symbol.
var pattern = "^[a-zA-Z0-9_]*$";
document.getElementById("newHashtag").addEventListener("keyup", function(event){
  event = event || window.event;
  var newValue = event.target.value || '';
  if (newValue.match(pattern)) {
      // Valid input; update previousValue:
      previousValue = newValue;
  }
  else{
      // Invalid input; reset field value:
      event.target.value = previousValue;
  }
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13){
    addNew();
  }
});

removeElements("essentialHashtags");
removeElements("newHashtags");
removeElements("additionalHashtags");
createElements(essentialHashtags);
createElements(newHashtags);
createElements(additionalHashtags);
selectElements(selectedEssential);
selectElements(selectedNew);
selectElements(selectedAdditional);
updateCounters();
lockAdditional();
