function convertSalesDate(salesDate) {
    const date = new Date(salesDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Convert date to week
    const weekNumber = Math.ceil(day / 7);

    // Convert date to season
    let season = '';
    switch (month) {
        case 12:
        case 1:
        case 2:
            season = 'Winter Flu Season';
            break;
        case 6:
        case 7:
        case 8:
        case 9:
            season = 'Monsoon Season';
            break;
        case 2:
        case 3:
        case 4:
            season = 'Spring Allergies';
            break;
        case 5:
        case 6:
        case 7:
            season = 'Summer Allergies';
            break;
        case 8:
        case 9:
        case 10:
            season = 'Fall Allergies';
            break;
        case 4:
        case 5:
        case 6:
            season = 'Boro Harvest';
            break;
        case 10:
        case 11:
        case 12:
            season = 'Aman Harvest';
            break;
        case 3:
        case 4:
        case 5:
            season = 'Aus Harvest';
            break;
        case 12:
        case 1:
        case 2:
            season = 'Winter Allergies';
            break;
        case 4:
        case 5:
            season = 'Pre-monsoon Season';
            break;
        case 10:
        case 11:
            season = 'Post-monsoon Season';
            break;
        default:
            season = 'Unknown Season';
    }

    return {
        year,
        month,
        weekNumber,
        season
    };
}

// Example usage:
const salesDate = '2022-011-30'; // Your sales date
const convertedDate = convertSalesDate(salesDate);
console.log(convertedDate);
