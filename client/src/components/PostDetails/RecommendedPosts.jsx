import { Typography, Grid } from "@mui/material";
import { Root, classes } from "./styles";
import { PostCard, LoadingCard } from "../User/Cards";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";
import { getRecommendedPosts } from "../../actions/posts";
import { ModeContext } from "../../contexts/ModeContext";

const RecommendedPosts = ({ user, tags, post_id }) => {
  const dispatch = useDispatch();
  const userId = user?.result.googleId || user?.result._id;
  useEffect(() => dispatch(getRecommendedPosts(tags.join(","))), [tags]);
  const { recommendedPosts, isFetchingRecommendedPosts: isLoading } =
    useSelector((state) => state.posts);

  const posts = recommendedPosts?.filter(({ _id }) => _id !== post_id);

  const { mode } = useContext(ModeContext);

  return (
    <Root className={classes.root} sx={{ width: "100%" }}>
      <Typography variant="h5" styles={{ textAlign: "left" }}>
        You might also like:
      </Typography>
      <div className={classes.recommendedPosts}>
        <div style={{ width: "100%" }}>
          {!isLoading && !posts.length ? (
            <Typography className={classes.notFound} gutterBottom variant="h6">
              No posts found with these tags
            </Typography>
          ) : (
            <Grid className={classes.recommendedPostGrid} container spacing={3}>
              {isLoading
                ? [...Array(10).keys()].map((key) => <LoadingCard key={key} />)
                : posts.map((post) => (
                    <PostCard key={post._id} post={post} userId={userId} />
                  ))}
            </Grid>
          )}
        </div>
      </div>
    </Root>
  );
};

export default RecommendedPosts;
