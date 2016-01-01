import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  host: 'http://localhost:3000',
  namespace: 'api/v1',
  shouldReloadRecord() {
    return true; 
  },
  shouldReloadAll() {
    return true; 
  },
  shouldBackgroundReloadRecord() {
    return true;
  },
  shouldBackgroundReloadAll() {
    return true;
  }
});

/* JSONAPIAdapter wasn't sending creation params to the API */

/*import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
	host: 'http://localhost:3000',
	namespace: 'api/v1',
  shouldReloadRecord() {
    return true; 
  },
  shouldReloadAll() {
  	return true; 
	},
  shouldBackgroundReloadRecord() {
  	return true;
  },
  shouldBackgroundReloadAll() {
    return true;
  }
});*/