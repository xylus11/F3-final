const accessToken = 'e9a017b02abb0a';
const getDataBtn = document.getElementById('get-data');
const sideimg = document.getElementById('side-img');
const mainContent = document.getElementById('main-content');
const map = document.getElementById('map');
const ipElement = document.getElementById('ip');
const lat = document.getElementById('lat');
const city = document.getElementById('city');
const organisation = document.getElementById('Organisation');
const long = document.getElementById('Long');
const region = document.getElementById('Region');
const timeZone = document.getElementById('time-zone');
const dateTime = document.getElementById('date-time');
const pincode = document.getElementById('pincode');
const message = document.getElementById('message');
const postOfficesList = document.getElementById('post-offices-list');
const filter = document.getElementById('filter');

let postOffices = [];

// Fetch user IP asynchronously
async function getUserIP() {
    try {
        const response = await fetch('https://jsonip.com/');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error fetching user IP:', error);
        return null;
    }
}

getDataBtn.addEventListener('click', fetchData);

async function fetchData() {
    getDataBtn.style.display = 'none';
    mainContent.style.display = 'block';
    sideimg.style.display = 'none';

    const userIP = await getUserIP();

    if (!userIP) {
        console.error('Unable to fetch user IP');
        return;
    }

    ipElement.innerHTML = userIP;

    try {
        const ipInfoResponse = await fetch(`https://ipinfo.io/${userIP}/json?token=${accessToken}`);
        const ipInfoData = await ipInfoResponse.json();

        console.log(ipInfoData);

        lat.innerHTML = `<h3>Lat : </h3> ${ipInfoData.loc.split(',')[0]}`;
        long.innerHTML = `<h3>Long : </h3> ${ipInfoData.loc.split(',')[1]}`;
        city.innerHTML = `<h3>City : </h3> ${ipInfoData.city}`;
        organisation.innerHTML = `<h3>Organisation : </h3> ${ipInfoData.org}`;
        region.innerHTML = `<h3>Region : </h3> ${ipInfoData.region}`;
        map.innerHTML = `<iframe src="https://maps.google.com/maps?q=${ipInfoData.loc.split(',')[0]}, ${ipInfoData.loc.split(',')[1]}&z=15&output=embed" width="360" height="270" frameborder="0" style="border:0"></iframe>`;

        timeZone.innerHTML = ipInfoData.timezone;
        const datetime_str = new Date().toLocaleString('en-US', { timeZone: `${ipInfoData.timezone}` });
        dateTime.innerHTML = datetime_str;
        pincode.innerHTML = ipInfoData.postal;

        const pincodeData = await fetch(`https://api.postalpincode.in/pincode/${ipInfoData.postal}`);
        const postalData = await pincodeData.json();

        console.log(postalData);

        message.innerHTML = postalData[0].Message;
        postOffices = postalData[0].PostOffice;

        console.log(postOffices);
        updatePostOffices(postOffices);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updatePostOffices(postOffices) {
    postOfficesList.innerHTML = ''; // Clear previous entries

    postOffices.forEach((post) => {
        postOfficesList.innerHTML += `<div class="post-office">
            <div class="post-office-name"><strong>Name :</strong> ${post.Name}</div>
            <div class="branch-type"><strong>Branch Type :</strong> ${post.BranchType}</div>
            <div class="delivery-status"><strong>Delivery Status :</strong> ${post.DeliveryStatus}</div>
            <div class="district"><strong>District :</strong> ${post.District}</div>
            <div class="division"><strong>Division :</strong> ${post.Division}</div>
        </div>`;
    });
}

filter.addEventListener('input', () => {
    const filterValue = filter.value.toLowerCase();
    const postLists = document.querySelectorAll('.post-office');

    postLists.forEach((post) => {
        const name = post.querySelector('.post-office-name').textContent.toLowerCase();
        const branchType = post.querySelector('.branch-type').textContent.toLowerCase();
        const deliveryStatus = post.querySelector('.delivery-status').textContent.toLowerCase();
        const district = post.querySelector('.district').textContent.toLowerCase();
        const division = post.querySelector('.division').textContent.toLowerCase();

        if (name.includes(filterValue) || branchType.includes(filterValue) || deliveryStatus.includes(filterValue) || district.includes(filterValue) || division.includes(filterValue)) {
            post.style.display = 'inline';
        } else {
            post.style.display = 'none';
        }
    });
});
