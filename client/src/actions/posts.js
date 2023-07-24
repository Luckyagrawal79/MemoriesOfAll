import {
  FETCHING_RECOMMENDED_POSTS,
  FETCH_RECOMMENDED,
  FETCHED_RECOMMENDED_POSTS,
  FETCH_ALL,
  FETCH_BY_SEARCH,
  USER_DETAILS,
  CREATE,
  UPDATE,
  DELETE,
  START_LOADING,
  END_LOADING,
  FETCH_POST,
  CREATED_POST,
  CREATING_POST,
  DELETING_POST,
  DELETED_POST,
} from "../constants/actionTypes";
import * as api from "../api";

const sanitize = ({ tags, search }) => {
  return {
    tags: tags.replace("#", "%23").replace(" ", "%20"),
    search: search?.replace("#", "%23").replace(" ", "%20"),
  };
};
export const getPosts = (page, snackBar) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data, curretPage: currentPage, numberOfPages },
    } = await api.fetchPosts(page);
    dispatch({
      type: FETCH_ALL,
      payload: { data, currentPage: currentPage, numberOfPages },
    });
    dispatch({ type: END_LOADING });
  } catch (error) {
    if (typeof error === "object") {
      snackBar("warning", `${error.message}: Please refresh after some time`);
      dispatch({ type: END_LOADING });
    } else {
      snackBar("error", error);
    }
  }
};

export const getUserDetails = (userId, snackBar) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.userDetails(userId);
    dispatch({ type: USER_DETAILS, payload: { data: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    if (typeof error === "object") {
      snackBar("warning", `${error.message}: Please Try again`);
      dispatch({ type: END_LOADING });
    } else {
      snackBar("error", error);
    }
  }
};

export const getUserPostsByType = (userId, page, type) => async (dispatch) => {
  const upperType = type.toUpperCase();
  const fetchingType = `FETCHING_${upperType}_POSTS`;
  const fetchType = `FETCH_${upperType}`;
  const fetchedType = `FETCHED_${upperType}_POSTS`;

  try {
    dispatch({ type: fetchingType });
    const {
      data: { data, numberOfPages },
    } = await api.fetchUserPostsByType(userId, page, type);
    dispatch({ type: fetchType, payload: { data, numberOfPages } });
    dispatch({ type: fetchedType });
  } catch (error) {
    console.log(error);
  }
};

export const getPost = (id, history, snackBar) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: { post: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    if (typeof error === "object") {
      snackBar("warning", `${error.message}: Please Try again`);
      dispatch({ type: END_LOADING });
    } else {
      snackBar("error", error.response.data);
      history("/");
    }
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  searchQuery = sanitize(searchQuery);
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchPostsBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
  }
};

export const getRecommendedPosts = (tags) => async (dispatch) => {
  tags = sanitize({ tags }).tags;
  try {
    dispatch({ type: FETCHING_RECOMMENDED_POSTS });
    const {
      data: { data },
    } = await api.fetchPostsBySearch({ tags: tags });
    dispatch({ type: FETCH_RECOMMENDED, payload: { data } });
    dispatch({ type: FETCHED_RECOMMENDED_POSTS });
  } catch (error) {
    console.log(error);
  }
};

export const createPost =
  (post, history, snackBar, callBack) => async (dispatch) => {
    try {
      dispatch({ type: CREATING_POST });
      const { data } = await api.createPost(post);
      dispatch({ type: CREATE, payload: data });
      history(`/posts/${data._id}`);
      snackBar("success", "Post created successfully");
      dispatch({ type: CREATED_POST });
    } catch (error) {
      if (typeof error === "object") {
        snackBar("warning", `${error.message}: Please Try again`);
        dispatch({ type: END_LOADING });
      } else {
        snackBar("error", error.response.data);
        history("/");
      }
      dispatch({ type: CREATED_POST });
    }
    callBack();
  };

export const updatePost = (id, post, snackBar) => async (dispatch) => {
  try {
    await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: post });
    if (snackBar) snackBar("info", "Post updated successfully");
  } catch (error) {
    snackBar("error", error);
  }
};

export const deletePost = (id, snackBar, callBack) => async (dispatch) => {
  try {
    dispatch({ type: DELETING_POST });
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
    dispatch({ type: DELETED_POST });
    location.reload();
    snackBar("info", "Post deleted successfully");
  } catch (error) {
    snackBar("error", error);
  }
  callBack(false);
};
