
const fetchCMCData = async (uri, endpoint) => {
    try {
        return await fetch(uri + endpoint, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.COINMARKET_CAP,
            },
        })
            .then(res => res.json())
            .then(data => data.data)
    } catch (e) {
        console.log(e)
    }
}

const fetchP2PData = async (uri, data) => {
    try {
        return await fetch(uri, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => data.data)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    fetchP2PData,
    fetchCMCData
}