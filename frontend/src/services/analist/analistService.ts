import apiClient from "@/services/apiClient";

//de momento hago un get para ver que funciona todo, pero esto cambiara despues
export const getAllAnalisis = async () => {
  return apiClient({
    method: "get",
    url: "/analist/getAllAnalisis",
  });
};
