function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  function getBusinessDaysRemaining() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let businessDaysRemaining = 0;
    let date = new Date(today);

    while (date.getMonth() === currentMonth) {
      if (!isWeekend(date)) {
        businessDaysRemaining++;
      }
      date.setDate(date.getDate() + 1);
    }

    return businessDaysRemaining;
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function displayDateAndBusinessDays() {
    const today = new Date();
    const businessDaysRemaining = getBusinessDaysRemaining();
    const formattedDate = formatDate(today);

    document.getElementById('currentDate').innerText = `Data atual: ${formattedDate}`;
    document.getElementById('businessDaysRemaining').innerText = `Dias úteis restantes: ${businessDaysRemaining}`;
  }

  document.addEventListener('DOMContentLoaded', displayDateAndBusinessDays);