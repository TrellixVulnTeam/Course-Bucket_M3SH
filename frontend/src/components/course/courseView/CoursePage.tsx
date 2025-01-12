import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { DoneAll, LabelImportant, NavigateNext } from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import { Course, PublicResponse } from "classes/Course";
import AuthService from "components/auth/api/AuthService";
import {
  CheckoutDialog,
  CongratulationDialog,
} from "components/course/courseView/Checkout";
import { FAQSection } from "components/course/courseView/FAQ";
import InstructorShortDetailsBox from "components/course/courseView/InstructorShortDetails";
import RatingSection from "components/course/courseView/Rating";
import { ReviewSection } from "components/course/courseView/Review";
import { Curriculum } from "components/course/createCourse/Curriculum/Curriculum";
import TeacherService from "components/person/api/TeacherService";
import { format } from "date-fns";
import User from "layout/User";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { IconPickerItem } from "react-fa-icon-picker";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { Sticky, StickyContainer } from "react-sticky";
import GridImageView from "tools/customDesign/ImageVeiw";
import { Responsive } from "tools/responsive/Responsive";
import CourseService from "../api/CourseService";
import { TeacherMiniInfo } from "./../../../classes/Person";

const useStyles = makeStyles((theme) => ({
  MuiListItemRoot: {
    alignItems: "flex-start",
  },
  MuiListItemGutters: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  MuiListItemAvatarRoot: {
    minWidth: 30,
  },
  MuiSvgIconRoot: {
    fontSize: "1.2rem",
    marginTop: 3,
  },
}));

export function CourseView() {
  const { courseId } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [checkoutShow, setCheckoutShow] = useState(false);
  const [congratulationShow, setCongratulationShow] = useState(false);
  const [course, setCourse] = useState<Course>(new Course());
  const [teacherInfo, setTeacherInfo] = useState<TeacherMiniInfo>();
  const [publicResponse, setPublicResponse] = useState<PublicResponse>();
  const [buyNowShow, setBuyNowShow] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [loading, setLoading] = useState(true);
  const [pageNotFound, setPageNotFound] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (courseId) {
      CourseService.existCourseByIdToShow(courseId).then((response) => {
        if (response.data) {
          loadCourseContent();
        } else {
          setPageNotFound(true);
        }
      });
    } else {
      setPageNotFound(true);
    }
  }, [courseId]);

  function handleCongratulationClose() {
    setCongratulationShow(false);
    loadCourseContent();
    // history.push(`/course/${courseId}`);
  }

  function handleOnPurchase() {
    CourseService.purchase(courseId).then((response) => {
      if (response.status == 200) {
        setCheckoutShow(false);
        setCongratulationShow(true);
      }
    });
  }

  function handleBuyNowClick() {
    if (AuthService.getCurrentAccountType() === "Student") {
      setCheckoutShow(true);
    } else {
      enqueueSnackbar('Please log in as "Student" to buy this course', {
        variant: "error",
      });
    }
  }

  async function loadCourseContent() {
    let teacherUsername = "";
    await CourseService.getCourseToShow(courseId).then((response) => {
      console.log("Course fetched", response.data);
      teacherUsername = response.data.teacherUsername;
      setCourse(response.data);
      handleReloadPublicResponse(response.data.teacherUsername);
    });
    if (AuthService.getCurrentAccountType() === "Student") {
      await CourseService.isBought(courseId).then((response) => {
        console.log("course bought", response.data);
        console.log("teacher username", course.teacherUsername);
        if (response.data) {
          setBuyNowShow(false);
        }
      });
    } else if (
      AuthService.getCurrentAccountType() == "Admin" ||
      AuthService.getCurrentUsername() == teacherUsername
    ) {
      setBuyNowShow(false);
    }
    console.log("loading will be false");
    setLoading(false);
  }

  async function handleReloadPublicResponse(teacherUsername: string) {
    await TeacherService.getMiniInfo(teacherUsername).then((response) => {
      console.log("Teacher mini info loaded", response.data);
      setTeacherInfo(response.data);
    });
    await CourseService.courseRatingReview(courseId).then((response) => {
      console.log("Course additional property fetched", response.data);
      setPublicResponse(response.data);
    });
  }

  function Price() {
    return (
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        {course?.mainPrice == 0 && (
          <Grid item>
            <Typography variant="h5">FREE</Typography>
          </Grid>
        )}
        {course?.mainPrice != 0 && (
          <>
            <Grid item>
              <Typography variant="h5">
                ৳
                {course?.mainPrice
                  ? course?.mainPrice - (course?.mainPrice * course?.off) / 100
                  : ""}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                style={{ textDecoration: "line-through" }}
              >
                ৳{course?.mainPrice}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{course?.off}% off</Typography>
            </Grid>
          </>
        )}
      </Grid>
    );
  }
  function TitleSection() {
    let date = new Date(course?.publishDate);
    let formattedDate = "";
    if (course.publishDate)
      formattedDate = format(date as Date, "hh:mm a - dd MMMM, yyyy");
    return (
      <>
        <Grid item>
          <Typography variant="h4">{course?.title}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">{course?.subTitle}</Typography>
        </Grid>
        <Grid item container direction="row" alignItems="center" spacing={1}>
          <Grid item>
            <Rating
              value={publicResponse?.ratingValue}
              readOnly
              name="rating"
            />
          </Grid>
          <Grid item>
            <Typography>
              ({publicResponse?.ratingCount} rating
              {publicResponse?.ratingCount && publicResponse?.ratingCount > 1
                ? "s"
                : ""}
              )
            </Typography>
          </Grid>
          <Grid item>
            {publicResponse?.enrolledStudentCount} student enrolled
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Typography>Created by :</Typography>
          <Link color="primary" href={`/profile/${course?.teacherUsername}`}>
            {course?.teacherName}
          </Link>
        </Grid>
        <Grid item container direction="row">
          <Grid item>Published date: {formattedDate}</Grid>
          <Grid item container direction="row" alignItems="center" spacing={1}>
            <Grid item>
              <Typography>Languages:</Typography>
            </Grid>
            {course?.languages.map((lang) => (
              <Grid item key={lang.id}>
                <Chip
                  style={{ color: "#ACE1E1", border: "2px solid #ACE1E1" }}
                  variant="outlined"
                  label={lang.name}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </>
    );
  }
  function CourseProperties() {
    return (
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h6">This course includes:</Typography>
        </Grid>
        <List dense={true}>
          {course?.properties.map((item, index) => (
            <ListItem
              key={item.id ? item.id : index}
              classes={{
                root: classes.MuiListItemRoot,
                gutters: classes.MuiListItemGutters,
              }}
            >
              <ListItemAvatar classes={{ root: classes.MuiListItemAvatarRoot }}>
                <IconPickerItem
                  // classes={{ root: classes.MuiSvgIconRoot }}
                  //@ts-ignore
                  icon={item.icon.content}
                  containerStyles={{ fontSize: "15px", color: "white" }}
                />
              </ListItemAvatar>
              <ListItemText>{item.text}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
    );
  }

  function PCHeader() {
    return (
      <Card
        style={{
          backgroundColor: "black",
          position: "relative",
          overflow: "inherit",
          boxShadow:
            "rgb(255 255 255 / 20%) 0px 0px 6px 3px, rgb(120 120 120 / 19%) 0px 0px 20px 7px",
        }}
      >
        <CardContent>
          <Grid container direction="row">
            <Grid item container md={8} xs={12} direction="column">
              <TitleSection />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
              style={{
                width: "100%",
                position: "absolute",
                right: 16,
              }}
            >
              <Sticky>
                {({ style }) => (
                  <Card style={{ ...style, zIndex: 999, marginLeft: 16 }}>
                    <CardContent>
                      <img src={course?.cover?.content} />
                      <Grid container>
                        <Grid
                          item
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Price />
                        </Grid>
                      </Grid>

                      {buyNowShow && (
                        <>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ width: "100%" }}
                              onClick={handleBuyNowClick}
                            >
                              Buy now
                            </Button>
                            <CheckoutDialog
                              open={checkoutShow}
                              course={course}
                              onClose={() => setCheckoutShow(false)}
                              onPurchase={handleOnPurchase}
                            />
                            <CongratulationDialog
                              open={congratulationShow}
                              course={course}
                              onClose={handleCongratulationClose}
                            />
                          </Grid>
                        </>
                      )}
                      <CourseProperties />
                    </CardContent>
                  </Card>
                )}
              </Sticky>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
  function MobileHeader() {
    return (
      <Card style={{ width: "100%", backgroundColor: "black" }}>
        <CardContent>
          <Grid container direction="column" spacing={1}>
            <Grid item container>
              <GridImageView
                src={course?.cover?.content}
                wrapperProps={{ xs: 8 }}
              />
            </Grid>
            <Grid item>
              <TitleSection />
            </Grid>
            <Grid item>
              <CourseProperties />
            </Grid>

            <Grid
              item
              container
              direction="row"
              style={{
                zIndex: 999,
                position: "fixed",
                bottom: 0,
                left: 0,
                padding: 0,
                backgroundColor: "#F3AA08",
                color: "black",
              }}
            >
              <Grid item xs={buyNowShow ? 6 : 12}>
                <Price />
              </Grid>

              {buyNowShow && (
                <Grid item container xs={6}>
                  <Button
                    onClick={handleBuyNowClick}
                    variant="contained"
                    color="primary"
                    style={{ width: "100%", borderRadius: 0, color: "black" }}
                  >
                    Buy now
                  </Button>
                  <CheckoutDialog
                    open={checkoutShow}
                    course={course}
                    onClose={() => setCheckoutShow(false)}
                    onPurchase={handleOnPurchase}
                  />
                  <CongratulationDialog
                    open={congratulationShow}
                    course={course}
                    onClose={handleCongratulationClose}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
  function EditableButtons() {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              history.push(`/create-course/${courseId}`);
            }}
          >
            Update
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={(event) => {
              history.push({
                pathname: `/create-course/${courseId}`,
                state: { duplicate: true },
              });
            }}
          >
            Duplicate
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={(event) => setDeleteConfirmation(true)}
          >
            Delete
          </Button>
          <Dialog open={deleteConfirmation}>
            <DialogTitle>Do you want to delete this course?</DialogTitle>
            <DialogContent>
              If you delete, you can not recover it.
            </DialogContent>
            <DialogActions>
              <Grid
                container
                direction="row"
                justifyContent="center"
                spacing={2}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(event) => {
                      CourseService.deleteCourse(courseId).then((response) => {
                        if (response.status === 200) {
                          enqueueSnackbar("Course successfully deleted");
                          history.push(`/profile/${course.teacherUsername}`);
                        }
                      });
                    }}
                  >
                    Yes
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(event) => setDeleteConfirmation(false)}
                  >
                    No
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    );
  }
  function Info() {
    return (
      <>
        <Grid item container>
          <Card style={{ width: "100%" }}>
            <CardContent>
              <Grid container direction="column">
                <Grid item>
                  <Typography variant="h5">What you'll learn</Typography>
                </Grid>
                <List dense={false}>
                  {course?.outcomes.map((item, index) => (
                    <ListItem
                      key={index}
                      classes={{
                        root: classes.MuiListItemRoot,
                        gutters: classes.MuiListItemGutters,
                      }}
                    >
                      <ListItemAvatar
                        classes={{ root: classes.MuiListItemAvatarRoot }}
                      >
                        <DoneAll classes={{ root: classes.MuiSvgIconRoot }} />
                      </ListItemAvatar>
                      <ListItemText>{item}</ListItemText>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item container>
          <Card style={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h5">Requirements</Typography>
              <List dense={false}>
                {course?.prerequisites.map((item, index) => (
                  <ListItem
                    key={index}
                    classes={{
                      root: classes.MuiListItemRoot,
                      gutters: classes.MuiListItemGutters,
                    }}
                  >
                    <ListItemAvatar
                      classes={{ root: classes.MuiListItemAvatarRoot }}
                    >
                      <LabelImportant
                        classes={{ root: classes.MuiSvgIconRoot }}
                      />
                    </ListItemAvatar>
                    <ListItemText>{item}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item container>
          <Card style={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h5">Description</Typography>
              <Typography>{course?.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </>
    );
  }
  function Content() {
    return (
      <Card style={{ width: "100%" }}>
        <CardContent>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h5">Course content</Typography>
            </Grid>
            <Grid item>
              <Curriculum
                editable={false}
                course={course}
                onCourseAttrChange={(course) => {}}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
  function InstructorDetails() {
    return <InstructorShortDetailsBox details={teacherInfo} />;
  }
  return (
    <User loading={loading} pageNotFound={pageNotFound}>
      <StickyContainer>
        <Grid container direction="column" spacing={2}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link color="inherit" href="/">
              {course?.mainCategory?.name}
            </Link>
            <Typography color="textPrimary">
              {" "}
              {course?.subCategory?.name}
            </Typography>
          </Breadcrumbs>
          <Grid item>
            <Responsive displayIn={["Laptop"]}>
              <PCHeader />
            </Responsive>
          </Grid>
          <Grid
            item
            container
            direction="column"
            alignItems="center"
            spacing={2}
            md={8}
          >
            <Grid item container>
              <Responsive displayIn={["Mobile", "Tablet"]}>
                <MobileHeader />
              </Responsive>
            </Grid>
            {AuthService.getCurrentUsername() === course.teacherUsername && (
              <Grid item>
                <EditableButtons />
              </Grid>
            )}
            <Info />
            <Grid item container>
              <Content />
            </Grid>
            <Grid item container>
              <InstructorDetails />
            </Grid>
            <Grid item container>
              <RatingSection
                courseId={courseId}
                data={publicResponse}
                onRatingSubmit={() =>
                  handleReloadPublicResponse(course?.teacherUsername)
                }
              />
            </Grid>
            <Grid item container>
              <ReviewSection
                courseId={courseId}
                teacherUsername={course.teacherUsername}
                reviews={
                  publicResponse?.reviews
                    ? publicResponse?.reviews[0].reviewInfos
                    : undefined
                }
                onReviewSubmit={() =>
                  handleReloadPublicResponse(course?.teacherUsername)
                }
              />
            </Grid>
            <Grid item container>
              <FAQSection
                courseId={courseId}
                teacherUsername={course.teacherUsername}
                faqs={
                  publicResponse?.faqs
                    ? publicResponse?.faqs[0].faqInfos
                    : undefined
                }
                onSubmit={() => {
                  handleReloadPublicResponse(course?.teacherUsername);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </StickyContainer>
    </User>
  );
}
