/**
 * @api {get} https://localhost:8000/api/users/:id
 * 
 * Get user by id
 * 
 * @apiName Get user by id
 * @apiGroup User
 * @apiVersion 0.0.1
 * 
 * @apiParam {String} id User id.
 * 
 * @apiExample {curl} Example usage:
 *  fetch('https://localhost:8000/api/users/:id')
 *      .then(r => r.json())
 *      .then(data => console.log(data));
 * 
 * @apiSuccess {String} uid User identificator.
 * @apiSuccess {String} token User acess token.
 * 
 * @apiError 400 Something went wrong.
 * @apiError 401 Wrong account id.
 */
