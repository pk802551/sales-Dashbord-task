import { configureStore } from '@reduxjs/toolkit';
import customerTypeReducer from '../Redux/customerTypeSlices';
import accountIndustryReducer from '../Redux/accountIndustrySlices';
import acvRangeReducer from '../Redux/acvRangeSlices';
import teamReducer from '../Redux/teamSlices';

 const store = configureStore({
  reducer: {
    customerType: customerTypeReducer,
    accountIndustry: accountIndustryReducer,
    acvRange: acvRangeReducer,
    team: teamReducer,
  },
});
export default store
