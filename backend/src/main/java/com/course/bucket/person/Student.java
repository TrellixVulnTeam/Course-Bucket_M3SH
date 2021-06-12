package com.course.bucket.person;


import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.course.bucket.database.DB;
import com.course.bucket.edustatus.EduStatus;
import com.course.bucket.course.Course;

public class Student extends Person{

    private EduStatus eduStatus;
    private Integer courseOwned;

    public Integer getCourseOwned() {
        return courseOwned;
    }

    public void setCourseOwned(Integer courseOwned) {
        this.courseOwned = courseOwned;
    }

    public List<Course> getCourses() {
        try {
            List<Course> courses = new ArrayList();
            ResultSet rs = DB.executeQuery("SELECT COURSE_ID FROM PURCHASE_HISTORY WHERE STUDENT_ID = '#' ORDER BY TIME DESC", getUsername());
            while(rs.next()){
                courses.add(new Course(rs.getInt("COURSE_ID")));
            }
            rs.close();
            return courses;
        } catch (SQLException ex) {
            System.err.println("error in get courses student");
        }
        return null;
    }    

    public EduStatus getEduStatus() {
        return eduStatus;
    }

    public void setEduStatus(EduStatus eduStatus) {
        this.eduStatus = eduStatus;
        DB.execute("UPDATE STUDENT SET EDU_STATUS_ID = #", eduStatus.getId().toString());
    }
    
    public Student(AccountType accountType, String username, String email, String password, String firstName, String lastName, String about, Date date){
        super(accountType, username, email, password, firstName, lastName, about, date);
        DB.execute("INSERT INTO STUDENT(ID) VALUES('#')", username);
    }
    
    public Student(String username) {
        super(username);
        String sql = "SELECT EDU_STATUS_ID FROM STUDENT WHERE ID = '#'";
        ResultSet rs = DB.executeQuery(sql, username);
        try {
            rs.next();
            if(rs.getInt("EDU_STATUS_ID")!=0) eduStatus = new EduStatus(rs.getInt("EDU_STATUS_ID"));
            sql = "SELECT ID FROM PURCHASE_HISTORY WHERE STUDENT_ID = '#'";
            ResultSet rs1 = DB.executeQuery(sql, username);
            int count = 0;
            while(rs1.next())
            {
                count++;
            }
            this.courseOwned = new Integer(count);
            rs1.close();
        } catch (SQLException ex) {
        	System.err.println("error in student");
        }
        //System.out.println(this.courseOwned);
    }
    
    public static boolean exist(String username) {
        return DB.valueExist("STUDENT", "ID", username);
    }

//    public void boughtCourse(Course course) {
//        new PurchaseHistory(course, GLOBAL.STUDENT, course.getCurrentPrice());
//    }

    public Integer getNumOfReview() {
        Integer value = null;
        ResultSet rs = DB.executeQuery("SELECT COUNT(*) FROM REVIEW WHERE STUDENT_ID = '#'", getUsername());
        try {
            rs.next();
            value = rs.getInt("COUNT(*)");
            rs.close();
        } catch (SQLException ex) {
        	System.err.println("error in getNumOfReview student");
        }
        return value;
    }

    public Integer getNumOfCourse() {
        Integer value = null;
        ResultSet rs = DB.executeQuery("SELECT COUNT(*) FROM PURCHASE_HISTORY WHERE STUDENT_ID = '#'", getUsername());
        try {
            rs.next();
            value = rs.getInt("COUNT(*)");
            rs.close();
        } catch (SQLException ex) {
        	System.err.println("error in getNumOfCourse student");
        }
        return value;
    }
    public static ArrayList<Student> getStudentList()
    {
        String sql = "SELECT ID FROM STUDENT ORDER BY ID";
        ArrayList<Student> list = new ArrayList<Student>();
        ResultSet rs = DB.executeQuery(sql);
        try {
            while(rs.next())
            {
                list.add(new Student(rs.getString("ID")));
            }
            rs.close();
        } catch (SQLException ex) {
        	System.err.println("error in getStudentList student");
        }
        return list;
    }
    
    public static void createNewStudent(Person person,Integer edu_id) {
    	Person.createNewPerson(person);
    	DB.execute("insert into student values('#',#)", person.getUsername(),edu_id.toString());
    }
}
