import ApiCalls from "@/services/ApiCalls.js";

export default {
	mixins: [ApiCalls],
	data() {
		return {
		}
	},
	methods: {

		/* Login.vue */
		/* getParticularCourseDetail */
		async getParticularCourseDetail(courseId) {

			try {
				let response = await this.getMethod("/getParticularCourseDetail", {
					courseId: courseId
				})
				return response
			} catch (error) {
			}
		},

		/* getStudentCourses - to get courseData */
		async getStudentCourses(params) {
			try {
				let response = await this.getMethod("/getStudentCourses", {
					classId: params.classId,
					studentId: params.studentId
				})
				this.courseData = response.data.data;
			} catch (error) {
			}
		},

		/* getCourseDiscussionesList - used in courseDiscussionForum.vue */
		async getCourseDiscussionesList(params) {
			try {
				let response = await this.getMethod("/getCourseDiscussionesList", {
					courseId: params.courseId,
					classId: params.classId,
				})
				this.courseDiscussionItems = response.data.data
				// return response
			} catch (error) {
			}
		},







		/***************************************************************************************************************************** */

		// APIS USED IN dashboard.vue
		/* studentMeetingEvents required in dashboard to display list of latest events */
		async studentMeetingEvents(params) {
			try {
				let response = await this.getMethod("/studentMeetingEvents", {
					studentId: params.studentId
				})
				return response
			} catch (error) {
			}

		},

		async getParticularMeetingEvent(params) {
			try {
				let response = await this.getMethod("/getParticularMeetingEvent", {
					meetingEventId: params.meetingEventId
				})
				// this.particularEvent.push = response.data.data
				return response
			} catch (error) {
			}
		},

		async getParticularSchoolEvent(params) {
			try {
				let response = await this.getMethod("/getParticularSchoolEvent", {
					schoolEventId: params.schoolEventId
				})
				// this.particularEvent = response.data.data
				return response
			} catch (error) {
			}
		},

		async getSchoolEventsList(params) {
			try {
				let response = await this.getMethod("/getSchoolEventsList")
				this.schoolEvents = response.data.data;
				return response
			} catch (error) {
			}

		},


		/************************************************************************************************************************ */

		/* APIS USED IN LiveOnlineClass.vue */
		async getLiveClassesesList(params) {
			try {
				let response = await this.getMethod("/getLiveClassesesList", {
					classId: params.classId,
					courseId: params.courseId,
					chapterId: params.chapterId,
				})
				return response
			} catch (error) {
			}
		},



		/*************************************************************************************************************************** */


		/* APIS USED IN announcement.vue */
		async getAnnoucementesList(params) {
			try {
				let response = await this.getMethod("/getAnnoucementesList", {
					courseId: params.courseId
				})
				return response;
			} catch (error) {
			}
		},

		/***********************************************************************************************/

		/* APIS USED IN AssignTeachers.vue */
		async getCourseesList(params) {
			try {
				let response = await this.getMethod("/getCourseesList", {
					classId: params.classId
				})
				this.courseData = response.data.data;
				return response;
			} catch (error) {
			}
		},

		async getTeachersList(params) {
			try {
				let response = await this.getMethod("/getTeachersList")
				this.teachersList = response.data.data;
				return response;
			} catch (error) {
			}
		},

	},
}