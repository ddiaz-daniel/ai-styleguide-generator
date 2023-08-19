function saveToPdf() {
    /*const element = document.documentElement;
    const options = {
        filename: 'styleguide.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { avoid: ['.pdf-content'] } // Specify the elements to avoid for page breaks
    };

    html2pdf().set(options).from(element).save();*/
    window.print();
}