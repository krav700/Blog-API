const API_URL = import.meta.env.VITE_API_URL;

async function fetchApi(path, methodType, bodyParams) {
    try {
        const response = await fetch(`${API_URL}${path}`, {
            method: methodType,
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            ...(bodyParams && { body: JSON.stringify(bodyParams) }),
        });

        const data = await response.json();
        if (!response.ok && response.status !== 400 || data.error) {
            console.log(data)
            throw new Error(
                data.error || `Request failed: ${response.status}`,
            );
        }

        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default fetchApi;
