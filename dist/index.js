import "core-js/modules/es.date.to-string";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.to-string";
import _getIterator from "@babel/runtime-corejs3/core-js/get-iterator";
import _slicedToArray from "@babel/runtime-corejs3/helpers/slicedToArray";
import _Object$entries from "@babel/runtime-corejs3/core-js/object/entries";
import _forEachInstanceProperty from "@babel/runtime-corejs3/core-js/instance/for-each";
import _defineProperty from "@babel/runtime-corejs3/helpers/defineProperty";
import _reduceInstanceProperty from "@babel/runtime-corejs3/core-js/instance/reduce";
import _Array$isArray from "@babel/runtime-corejs3/core-js/array/is-array";
import _regeneratorRuntime from "@babel/runtime-corejs3/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime-corejs3/helpers/asyncToGenerator";
import Enum from 'es6-enum';
import React from 'react';
import Immutable from 'immutable';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux'; // simple utilities

var resolveData =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(dataOrPromiseOrFunction) {
    var dataOrPromise;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dataOrPromise = typeof dataOrPromiseOrFunction === 'function' ? dataOrPromiseOrFunction() : dataOrPromiseOrFunction;

            if (!(dataOrPromise && dataOrPromise.then)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return dataOrPromise;

          case 4:
            _context.t0 = _context.sent;
            _context.next = 8;
            break;

          case 7:
            _context.t0 = dataOrPromise;

          case 8:
            return _context.abrupt("return", _context.t0);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function resolveData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var rolesToMapUpdate = function rolesToMapUpdate(rolesItem, value) {
  if (_Array$isArray(rolesItem)) {
    return _reduceInstanceProperty(rolesItem).call(rolesItem, function (result, item) {
      return result[item] = value, result;
    }, {});
  } else if (typeof rolesItem === 'string' || Object.prototype.toString(rolesItem) === '[object String]') {
    return _defineProperty({}, rolesItem, value);
  } else {
    return {};
  }
};

var resolveRoles = function resolveRoles(rolesItem, value) {
  return resolveData(rolesItem).then(function (rolesItem) {
    return rolesToMapUpdate(rolesItem, value);
  });
};

var ACTIONS = Enum('MERGE_ROLES', 'CLEAR_ROLES');
var ConfigContext = React.createContext();
var defaultState = Immutable.Map({
  roles: Immutable.Set()
});

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case ACTIONS.MERGE_ROLES:
      return state.set('roles', state.get('roles').withMutations(function (roles) {
        var _context2;

        _forEachInstanceProperty(_context2 = _Object$entries(action.roles)).call(_context2, function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

          if (value) {
            roles.remove(key);
          } else {
            roles.add(key);
          }
        });
      }));

    case ACTIONS.CLEAR_ROLES:
      return state.set('roles', Immutable.Set());
  }

  return state;
}

var configStore = createStore(reducer, applyMiddleware(thunk));

var configConnect = function configConnect(options) {
  return function (Component) {
    var mapStateToProps = options.mapStateToProps,
        mapDispatchToProps = options.mapDispatchToProps;
    var ConnectedComponent = connect(mapStateToProps, mapDispatchToProps, null, {
      context: ConfigContext
    })(Component);
    return function (props) {
      return React.createElement(Provider, {
        context: ConfigContext,
        store: configStore
      }, React.createElement(ConnectedComponent, props));
    };
  };
};

var addRoles = function addRoles(roles) {
  return function (dispatch) {
    return resolveRoles(roles, true).then(function (roles) {
      return dispatch({
        type: ACTIONS.MERGE_ROLES,
        roles: roles
      });
    });
  };
};

var removeRoles = function removeRoles(roles) {
  return function (dispatch) {
    return resolveRoles(roles, false).then(function (roles) {
      return dispatch({
        type: ACTIONS.MERGE_ROLES,
        roles: roles
      });
    });
  };
};

var mergeRoles = function mergeRoles(roles) {
  return function (dispatch) {
    return resolveData(roles).then(function (roles) {
      return dispatch({
        type: ACTIONS.MERGE_ROLES,
        roles: roles
      });
    });
  };
};

var clearRoles = function clearRoles(dispatch) {
  return dispatch({
    type: ACTIONS.CLEAR_ROLES
  });
};

export var wrapWithDispatch = function wrapWithDispatch(dispatch, obj) {
  var _context3;

  return _reduceInstanceProperty(_context3 = _Object$entries(obj)).call(_context3, function (result, _ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];

    return result[key] = function () {
      return dispatch(value.apply(void 0, arguments));
    }, result;
  }, {});
};
export var configPick = function configPick() {
  for (var _len = arguments.length, picked = new Array(_len), _key = 0; _key < _len; _key++) {
    picked[_key] = arguments[_key];
  }

  function mapDispatchToProps(dispatch) {
    var result = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(picked), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pick = _step.value;

        switch (pick) {
          case 'add':
            result.addRoles = addRoles;
            break;

          case 'remove':
            result.removeRoles = removeRoles;
            break;

          case 'merge':
            result.mergeRoles = mergeRoles;
            break;

          case 'clear':
            result.clearRoles = clearRoles;
            break;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return wrapWithDispatch(dispatch, result);
  }

  function mapStateToProps(store, props) {
    var result = {};
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _getIterator(picked), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var pick = _step2.value;

        switch (pick) {}
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return result;
  }

  return configConnect({
    mapStateToProps: mapStateToProps,
    mapDispatchToProps: mapDispatchToProps
  });
};
//# sourceMappingURL=index.js.map