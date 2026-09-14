async function fetchApi(path, methodType, bodyParams) {
    try {
        const response = await fetch(path, {
            method: methodType,
            headers: {
                "Content-Type": "application/json",
                "authorization": localStorage.getItem("token")
            },
            ...(bodyParams && { body: JSON.stringify(bodyParams) }),
        });

        if (response.status === 403) {
            window.location.href = "/auth/login"
        }

        const data = await response.json();
        if (!response.ok) {
            console.log(data)
            throw new Error(
                data.message || `Request failed: ${response.status}`,
            );
        }

        return data;
    } catch (err) {
        console.log(err);
        console.log("yo")
        throw err;
    }
}

export default fetchApi;
