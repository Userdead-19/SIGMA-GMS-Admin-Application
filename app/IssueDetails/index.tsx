// app/details.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { UserProvider, useUser } from "@/Hooks/UserContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar } from "react-native-paper";

const { width, height } = Dimensions.get("window");

interface Issue {
  _id: { $oid: string };
  issueNo: string;
  time: string;
  date: string;
  raised_by: { name: string; personId: string };
  issue: {
    issueLastUpdateTime: string;
    issueLastUpdateDate: string;
    issueType: string;
    issueCat: string;
    issueContent: string;
    block: string;
    floor: string;
    actionItem: string;
  };
  comments: { date: string; by: string; content: string }[];
  status: string;
  log: { date: string; action: string; by: string }[];
  survey: {};
  anonymity: string;
}

export default function IssueDetails() {
  const navigation = useNavigation();
  const user = useUser();
  const params = useGlobalSearchParams();
  const issue: Issue = params.issue
    ? JSON.parse(Array.isArray(params.issue) ? params.issue[0] : params.issue)
    : null;

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(issue.comments);

  const handleAddComment = async () => {
    try {
      if (newComment.trim()) {
        const newCommentObj = {
          date: new Date().toLocaleString(),
          by: user.id, // replace with actual current user ID
          content: newComment,
        };
        setComments([...comments, newCommentObj]);
        const body = {
          user_id: user.id,
          content: newComment,
        };
        const response = await axios.post(
          `https://api.gms.intellx.in/task/add-comment/${issue.issueNo}`,
          body
        );
        if (response.status === 200) {
          Alert.alert("Comment added successfully");
        }
        setNewComment("");
      }
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to add comment", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to add comment", "An unexpected error occurred.");
      }
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const reopenIssue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `https://api.gms.intellx.in/task/open/${issue.issueNo}`,
        body
      );
      if (response.status === 200) {
        Alert.alert("Issue has been reopened successfully");
        navigation.goBack();
      }
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to reopen issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to reopen issue", "An unexpected error occurred.");
      }
    }
  };
  const CloseISsue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `https://api.gms.intellx.in/task/close/${issue.issueNo}`,
        body
      );
      if (response.status === 200) {
        Alert.alert("Issue has been closed successfully");
        navigation.goBack();
      }
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to close issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to close issue", "An unexpected error occurred.");
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        {/* <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <View style={styles.box}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{issue?.issue.issueCat}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{issue?.status}</Text>
          </View>
        </View>
        <View style={styles.detailsBox}>
          <Text style={styles.detailsText}>Block: {issue?.issue.block}</Text>
          <Text style={styles.detailsText}>Floor: {issue?.issue.floor}</Text>
          <Text style={styles.detailsText}>
            Type: {issue?.issue.issueType}
          </Text>
          <Text style={styles.detailsText}>
            Content: {issue?.issue.issueContent}
          </Text>
          <Text style={styles.detailsText}>
            Action Item: {issue?.issue.actionItem}
          </Text>
          <Text style={styles.detailsText}>
            Last Update: {issue?.issue.issueLastUpdateDate}{" "}
            {issue?.issue.issueLastUpdateTime}
          </Text>
        </View>
        {issue?.status === "OPEN" ? (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              CloseISsue();
            }}
          >
            <Text style={styles.closeButtonText}>CLOSE THIS ISSUE</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              reopenIssue();
            }}
          >
            <Text style={styles.closeButtonText}>REOPEN THIS ISSUE</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.commentsHeading}>COMMENTS</Text>
        {comments.map((comment, index) => (
          <View key={index} style={styles.commentBox}>
            <Text style={styles.commentUser}>{comment.by}</Text>
            <Text style={styles.commentContent}>{comment.content}</Text>
          </View>
        ))}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddComment}
          >
            <AntDesign name="plus" size={20} color="#555555" />
          </TouchableOpacity>
        </View>
      </View>
    </View> */}
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontStyle: "italic", fontSize: 10 }}>
                Category
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
              >
                {issue?.issue.issueCat}
              </Text>
            </View>
            <View>
              {issue?.status == "CLOSE" ? (
                <Feather name="check-circle" size={27} color="green" />
              ) : (
                <SimpleLineIcons name="close" size={27} color="red" />
              )}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "0.1%",
              backgroundColor: "black",
              marginTop: 17,
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text>
                Lastly Updated Date : {issue?.issue.issueLastUpdateDate}{" "}
              </Text>
            </View>
            <View>
              <Text>Time : {issue?.issue.issueLastUpdateTime}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, gap: 10 }}>
            <Text style={styles.detailsText}>
              Floor : {issue?.issue.floor}{" "}
            </Text>
            <Text style={styles.detailsText}>
              Block : {issue?.issue.block} block{" "}
            </Text>
            <Text style={styles.detailsText}>
              Type : {issue?.issue.issueType}
            </Text>
            <Text style={styles.detailsText}>
              Content : {issue?.issue.issueContent}
            </Text>
            <Text style={styles.detailsText}>
              Action Item : {issue?.issue.actionItem}
            </Text>
          </View>
          {issue?.status === "OPEN" ? (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                CloseISsue();
              }}
            >
              <Text style={styles.closeButtonText}>REVERT THIS ISSUE</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                reopenIssue();
              }}
            >
              <Text style={styles.closeButtonText}>REOPEN THIS ISSUE</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.commentsHeading}>COMMENTS</Text>
          {comments
            .filter((comment) => comment.content.trim())
            .map((comment, index) => (
              <View key={index} style={styles.commentBox}>
                <Text style={styles.commentUser}>{comment.by}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddComment}
            >
              <AntDesign name="plus" size={15} color="#555555" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: "2%",
    marginBottom: "5%",
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFFFFF",
    minHeight: height,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    // shadowColor: "#000000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
  },
  headingText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
  detailsContainer: {
    // borderWidth: 1,
    // borderColor: "#DDE6F0",
    // borderRadius: 10,
    padding: 20,
    backgroundColor: "#FFFFFF",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#E6F0FF",
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#003366",
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentContent: {
    fontSize: 12,
    marginTop: 1,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    fontSize: 12,
    color: "#333333",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDE6F0",
  },
});
