package com.course.bucket.person;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.course.bucket.authentication.JwtUtils;
import com.course.bucket.designation.Designation;


@RestController
public class TeacherController {
	
	@PostMapping(value="/add-teacher/{desig_id}")
	public void addTeacher(@ModelAttribute Person person,@PathVariable Integer desig_id) {
		Teacher.createNewTeacher(person,desig_id);
	}
	
	@GetMapping("/get-teacher/{id}")
	public Teacher findTeacher(@PathVariable String id){
		return new Teacher(id);
	}

	@GetMapping("/get-teacher-self")
	public ResponseEntity<?> getTeacherSelf(){
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Teacher person = new Teacher(userDetails.getUsername());
		person.setPassword("");
		return ResponseEntity.ok(person);
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
	@DeleteMapping("/delete-teacher/{id}")
	public void deleteTeacher(@PathVariable String id) {
		Person.deletePerson(id);
	}
	

//	Mehedi
	@PutMapping("/update-teacher/{designationId}")
	public void updateStudent(@PathVariable Integer designationId, @RequestBody Person person) {
		Teacher.update(person, designationId);
	}
}
