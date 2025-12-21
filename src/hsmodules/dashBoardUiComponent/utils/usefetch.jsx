import {useState, useEffect} from "react";

const useFetch = (service, query) => {
  const [data, setData] = useState({});
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const userDetails = localStorage.getItem("user");

  const facilityId = JSON.parse(userDetails).employeeData[0].facility;

  useEffect(() => {
    service
      .find({
        query: {...query,  $limit: 0}, //facility: facilityId,
      })
      .then(result => {
        // Once both return, update the stat

        setIsPending(false);
        setData(result);
        setError(null);
        // console.log(result, service)
      })
      .catch(error => {
        setError(error);
      });
   // service.on("created", data => {});
   
  }, [service, facilityId]);

  return {data, isPending, error};
};

export default useFetch;

