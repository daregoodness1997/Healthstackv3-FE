export const processFinanceRevenueData = (data) => {
    const categories = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0,0,0)

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const now = new Date();

    // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
    const dayOfWeek = now.getDay();

    // Calculate the difference in days to the previous Sunday (start of last week)
    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - dayOfWeek - 7);
    startOfLastWeek.setHours(0, 0, 0, 0); // Set to midnight (start of the day)

    // Calculate the end of last week (Saturday)
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    endOfLastWeek.setHours(23, 59, 59, 999); // Set to the last millisecond of the day





    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Set to Monday of current week
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const amount=200

   
  
    data.forEach(item => {
      const category = item.facilityname;
      const amount = parseFloat(item.amount) || 0;
      const createdAt = new Date(item.createdAt);
  
      if (!categories[category]) {
        categories[category] = {
          revenueDay: 0,
          revenueToday: 0,
          revenueWeek: 0,
          revenueLast: 0,
          revenueMonth: 0,
          revenueYear: 0,
        };
      }
  
      // Calculate revenue for different time periods
    
      if (createdAt >= startOfToday) {
        categories[category].revenueToday++  //+= mount;
      }
      if (createdAt >= yesterday && createdAt < startOfToday) { //createdAt.toDateString() === yesterday.toDateString()
        categories[category].revenueDay++  //+= mount;
      } 
      if (createdAt >= endOfLastWeek && createdAt <= today) {
        categories[category].revenueWeek++ // += amount;
      }
      if (createdAt >=  startOfLastWeek && createdAt <=endOfLastWeek) {
        categories[category].revenueLast++ // += amount;
      }
      if (createdAt >= startOfMonth && createdAt <= today) {
        categories[category].revenueMonth++ // += amount;
      }
      if (createdAt >= startOfYear && createdAt <= today) {
        categories[category].revenueYear++ // += amount;
      }
    });
  
    // Convert to array and sort by totalRevenue in descending order
    /* const sortedCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b.totalRevenue - a.totalRevenue); */

      const sortedCategories= Object.entries(categories).sort((a,b)=>b.revenueYear-a.revenueYear)
  
    // Map to final format with unique serial numbers
    return sortedCategories.map(([category, revenue], index) => ({
      sn: index + 1,
      createdAt: today.toISOString(),
      category,
      revenueToday: revenue.revenueToday,
      revenueDay: revenue.revenueDay,
      revenueWeek: revenue.revenueWeek,
      revenueLast: revenue.revenueLast,
      revenueMonth: revenue.revenueMonth,
      revenueYear: revenue.revenueYear,
    }));
  };

// export const processInventoryData = (inventoryData) => {
//     const categories = {};
//     const dailyAmounts = {};
//     const weeklyAmounts = {};
  
//     inventoryData.forEach(item => {
//       const category = item.info.orderInfo.orderObj.order_category;
//       const amount = item.amount;
//       const date = new Date(item.createdAt);
//       const dayKey = date.toISOString().split('T')[0];
//       const weekKey = getWeekNumber(date);
  
//       // Process categories
//       if (!categories[category]) {
//         categories[category] = true;
//       }
  
//       // Process daily amounts
//       if (!dailyAmounts[category]) {
//         dailyAmounts[category] = {};
//       }
//       if (!dailyAmounts[category][dayKey]) {
//         dailyAmounts[category][dayKey] = 0;
//       }
//       dailyAmounts[category][dayKey] += amount;
  
//       // Process weekly amounts
//       if (!weeklyAmounts[category]) {
//         weeklyAmounts[category] = {};
//       }
//       if (!weeklyAmounts[category][weekKey]) {
//         weeklyAmounts[category][weekKey] = 0;
//       }
//       weeklyAmounts[category][weekKey] += amount;
//     });
  
//     return {
//       categories: Object.keys(categories),
//       dailyAmounts,
//       weeklyAmounts
//     };
//   };
  
//   // Helper function to get week number
//   const getWeekNumber = (date) => {
//     const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//     const dayNum = d.getUTCDay() || 7;
//     d.setUTCDate(d.getUTCDate() + 4 - dayNum);
//     const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
//     return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
//   };