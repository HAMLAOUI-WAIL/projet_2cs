import mongoose from "mongoose";
import Post from "./Post.js";
import filter from "../util/filter.js";

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    commenter: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "comment",
    },
    children: [
      {
        type: mongoose.Types.ObjectId,
        ref: "comment",
      },
    ],
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CommentSchema.post("remove", async function (res, next) {
  const comments = await this.model("comment").find({ parent: this._id });

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    await comment.remove();
  }

  next();
});

CommentSchema.pre("save", function (next) {
  if (this.content.length > 0) {
    this.content = filter.clean(this.content);
  }

  next();
});

const CommentModel = mongoose.model("comment", CommentSchema);

export default CommentModel;