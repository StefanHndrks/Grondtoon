import Ember from 'ember';

export function add(params/*, hash*/) {
  let result = 0;

  for (let i = 0; i < params.length; i++) {
    result += params[i];
  }
  return result;
}

export default Ember.Helper.helper(add);
