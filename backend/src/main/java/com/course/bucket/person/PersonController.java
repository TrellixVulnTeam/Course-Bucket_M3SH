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
public class PersonController {
	
	@PostMapping("/add-person")
	public void addPerson(@RequestBody Person person) {
		Person.createNewPerson(person);
	}
	
	@GetMapping("/get-person-by-id/{id}")
	public Person findPerson(@PathVariable String id){
		return new Person(id);
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
	@DeleteMapping("/delete-person/{name}")
	public void deletePerson(@PathVariable String name) {
		Person.deletePerson(name);
	}
}
