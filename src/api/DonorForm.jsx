import { getStates, getCitiesByState } from "../../api/stateService";

useEffect(() => {
  getStates().then(res => setStates(res.data));
}, []);

const handleStateChange = (e) => {
  let state = e.target.value;

  getCitiesByState(state).then(res => setCities(res.data));
};
