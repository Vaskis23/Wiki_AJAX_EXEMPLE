let languages = []

const getProgrammingLanguagesList = () => {
    let xhr = new XMLHttpRequest()

    xhr.open('GET', 'https://en.wikipedia.org/wiki/List_of_programming_languages')
    xhr.onload = () => {
        let response = xhr.responseText
        let parser = new DOMParser()
        let doc = parser.parseFromString(response, "text/html")

        let anchors = doc.querySelectorAll('div.div-col ul li a')
        languages = [...anchors].map(a => {
            return {
                name: a.innerHTML,
                url: a.href.replace("http://127.0.0.1:5500", "https://en.wikipedia.org") //find a better way
            }
        })
    }
    xhr.send()
}

const filterProgrammingLanguages = (e) => { // Add 'e' as a parameter to capture the event
    let input = e.target
    let kw = input.value

    let results = document.getElementById('resultsDiv')
    results.innerHTML = '' // Move this line above 'let results = ...'

    if (kw.length >= 2) {
        let dropdownUl = document.createElement('ul')
        dropdownUl.className = "dropdown-menu show"

        languages
            .filter(l => {
                return l.name.toLowerCase().startsWith(kw.toLowerCase())
            }).forEach(l => {
                let listItem = document.createElement('li')
                dropdownUl.appendChild(listItem)
                let link = document.createElement('a')
                link.innerHTML = l.name
                link.href = l.url
                link.className = "dropdown-item"

                // HW1: Add event listener on result links, capture the event
                link.addEventListener('click', (event) => {
                    event.preventDefault(); // Don't let the default effect happen

                    let clickedLink = event.target;
                    let linkUrl = clickedLink.href;

                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', linkUrl);
                    xhr.onload = () => {
                        let response = xhr.responseText;
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response, "text/html");

                        // HW2: Load / parse the document
                        let paragraphs = doc.querySelectorAll('p');

                        // Copy the first few paragraphs
                        let textToShow = '';
                        for (let i = 0; i < 3 && i < paragraphs.length; i++) {
                            textToShow += paragraphs[i].textContent + '<br>';
                        }

                        // Show it in a div below
                        let contentDiv = document.createElement('div');
                        contentDiv.innerHTML = textToShow;
                        results.appendChild(contentDiv);
                    };
                    xhr.send();
                });

                listItem.appendChild(link);
            });
        results.appendChild(dropdownUl);
    }
}
//HW add event listener on result links, capture the event
//don't let the default effect happer
//send another AJAX requet on the link's address
//load / parse the doc
//copy the first few paragraphs
//show it in a div below
