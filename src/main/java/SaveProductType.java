/**
 * This java servlet class sends data through html form(admin.html) to the postgreSQL database table Product Type.
 */

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/SaveProductType")
public class SaveProductType extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Response set as html
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Retrieve data from html elements
        int product_type_id = Integer.parseInt(request.getParameter("product_type_id"));
        String name = request.getParameter("name");
        int manufacturer_id = Integer.parseInt(request.getParameter("manufacturer_id"));

        int status = 0;

        try {

            // Establish Database Connection
            Connection connection = DatabaseConnection.getConnection();

            // Insert data query
            PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into product_type(id,name,manufacturer_id) values (?,?,?)");
            preparedStatement.setInt(1, product_type_id);
            preparedStatement.setString(2, name);
            preparedStatement.setInt(3, manufacturer_id);

            // Execute query
            status = preparedStatement.executeUpdate();

            // Validate query status
            if (status > 0) {
                out.print("<p>Record saved successfully!</p>");
            } else {
                out.print("<p>Unable to save record!</p>");
            }
            request.getRequestDispatcher("admin").include(request, response);

            // Close database connection
            connection.close();

        } catch (Exception ex) {
            out.print("<p>Unable to save record!</p>");
            request.getRequestDispatcher("admin").include(request, response);
        }
        out.close();
    }
}