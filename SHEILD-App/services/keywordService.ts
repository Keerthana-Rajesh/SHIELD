import BASE_URL from "../config/api";

export const fetchKeywords = async (userId: string | null) => {

    try {

        const response = await fetch(`${BASE_URL}/keywords/${userId}`);
        const data = await response.json();

        return {
            lowKeywords: data.lowRiskKeywords,
            highKeywords: data.highRiskKeywords
        };

    } catch (error) {

        console.log("Keyword fetch error", error);

        return { lowKeywords: [], highKeywords: [] };

    }

};