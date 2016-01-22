import ActiveModelAdapter from 'active-model-adapter';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default ActiveModelAdapter.extend({
  host: 'http://localhost:3000',
  namespace: 'api/v1',
  authorizer: 'authorizer:devise',
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