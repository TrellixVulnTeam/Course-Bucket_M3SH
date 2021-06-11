package com.course.bucket.person;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class StudentController {
	
	@PostMapping("/add-student/{edu_id}")
	public void addStudent(@RequestBody Person person,@PathVariable Integer edu_id) {
		Student.createNewStudent(person,edu_id);
	}
	
	@GetMapping("/get-student/{id}")
	public Student findStudent(@PathVariable String id){
		return new Student(id);
	}
//	
//	@GetMapping("/get-person-by-name/{name}")
//	public Person findById(@PathVariable String name) {
//		Person person = new Person(name);
//		return person;
//	}
//		
//	
//	@PutMapping("/update-person/{oldName}/{newName}")
//	public void updatePerson(@PathVariable String oldName, @PathVariable String newName) {
//		Person.changePersonName(oldName, newName);
//	}
//	
	@DeleteMapping("/delete-student/{id}")
	public void deleteStudent(@PathVariable String id) {
		Person.deletePerson(id);
	}
}
