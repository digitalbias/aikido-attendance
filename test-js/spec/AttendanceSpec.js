var studentData = [{
    "first_name":  "David",
    "last_name":  "Mitchell",
	"join_date": "2000-08-01",
	"ranks":[
		{"name":"Rokkyu","alternate_name":"6th Kyu","date":"2000-12-01"},
		{"name":"Gokkyu","alternate_name":"5th Kyu","date":"2001-04-13"},
		{"name":"Shikyu","alternate_name":"4th Kyu","date":"2001-12-14"},
		{"name":"Sankyu","alternate_name":"3rd Kyu","date":"2002-04-12"},
		{"name":"Nikyu","alternate_name":"2rd Kyu","date":"2003-04-11"},
		{"name":"Ikkyu","alternate_name":"1st Kyu","date":"2004-10-08"},
		{"name":"Shodan","alternate_name":"1st Dan","date":"2007-03-01"}
	],
    "first_name":  "Emily",
    "last_name":  "Mitchell",
	"join_date": "2011-08-01",
    "ranks": [
		{"name":"Hachikyu","alternate_name":"6th Kyu","date":"2011-08-01"}
    ]
}];

describe("Student", function () {

    beforeEach(function () {
        this.student = new Student(studentData[0]);
    });

    it("creates from data", function () {
        expect(this.student.get('ranks').length).toEqual(2);
    });

	

});
