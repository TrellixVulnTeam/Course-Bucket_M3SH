package com.course.bucket.person;


public class StudentInfoAdmin {

	private String username;
	private Integer courseOwned;
	private Double moneySpent;
	
	
	public StudentInfoAdmin(String username, Integer courseOwned, Double moneySpent) {
		super();
		this.username = username;
		this.courseOwned = courseOwned;
		this.moneySpent = moneySpent;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public Integer getCourseOwned() {
		return courseOwned;
	}


	public void setCourseOwned(Integer courseOwned) {
		this.courseOwned = courseOwned;
	}


	public Double getMoneySpent() {
		return moneySpent;
	}


	public void setMoneySpent(Double moneySpent) {
		this.moneySpent = moneySpent;
	}
	
	
	
}
