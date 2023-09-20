import { useState, useEffect } from "react";

export default function useFetch(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: string) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
    
        fetch(url, {
            method: method,
            headers: { content: 'application/json' },
            body: JSON.stringify(body)
        })
        .then((result) => {
            result.json()
            .then((data) => {
                console.log(data);
                setData(data);
            });
        })
        .catch((error) => {
            console.log(error);
            setError(error)
        })
        .finally(() => setLoading(false));
    }, ['url']);


    function retry() {
        setLoading(true);
    
        fetch(url, {
            method: method,
            headers: { content: 'application/json' },
            body: JSON.stringify(body)
        })
        .then((result) => {
            result.json()
            .then((data) => {
                console.log(data);
                setData(data);
            });
        })
        .catch((error) => {
            console.log(error);
            setError(error)
        })
        .finally(() => setLoading(false));
    }

    return {loading, data, error, retry};
}