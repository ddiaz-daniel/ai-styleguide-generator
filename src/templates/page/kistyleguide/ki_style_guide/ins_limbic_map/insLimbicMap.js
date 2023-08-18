//limbic map
document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelectorAll("#image-map svg a").forEach(function (item) {
        // add event listener
        item.addEventListener("click", (event) => {
            event.preventDefault();
            console.log('clicked')
            const title = item.getAttribute("title");
            const cBox = document.querySelector("input[value=" + title + "]");
            console.log(cBox.checked);
            if (item.classList.contains("selected") && cBox.checked) {
                item.classList.remove("selected")
                cBox.checked = false;
            } else {
                item.classList.add("selected")
                cBox.checked = true;
            }
            return false;
        });

        if (item.getElementsByTagName("text").length > 0) {
            const svgns = "http://www.w3.org/2000/svg";
            const marginLR = 6;
            const marginTB = 1;
            const textBB = item.getElementsByTagName("text")[0].getBBox();
            const rect = document.createElementNS(svgns, 'rect');
            rect.setAttribute('x', (textBB.x - marginLR).toString());
            rect.setAttribute('y', (textBB.y - marginTB).toString());
            rect.setAttribute('height', (textBB.height + 2 * marginTB).toString());
            rect.setAttribute('width', (textBB.width + 2 * marginLR).toString());
            rect.setAttribute('fill', 'transparent');
            item.insertBefore(rect, item.firstChild);
        }

    })
});