import {put} from 'redux-saga/effects';
import axios from '../../shared/axios-instance';

import * as actions from '../actions/index';

export function* fetchUsersDataSaga(action) {
    yield put(actions.fetchUsersDataStart);
    try {
        const response = yield axios.get('/users.json');
        const fetchedData = [];
        for (let key in response.data) {
            fetchedData.push({
                ...response.data[key],
                id: key
            });
        }
        yield put(actions.fetchUsersDataSuccess(fetchedData));
    } catch (error) {
        yield put(actions.fetchUsersDataFailed(error));
    }
}